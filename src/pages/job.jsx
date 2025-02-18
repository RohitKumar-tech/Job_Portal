import { getSingleJob, updateHiringStatus } from "@/api/apiJobs";
import useFetch from "@/hooks/use-fetch";
import { useUser } from "@clerk/clerk-react";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import MDEditor from "@uiw/react-md-editor";
import {
  BriefcaseBusinessIcon,
  DoorClosed,
  DoorOpen,
  MapPinIcon,
} from "lucide-react";
import { useEffect } from "react";
import { useParams } from "react-router-dom";
import { BarLoader } from "react-spinners";
import ApplyJobDrawer from "@/components/apply-job";

const JobPage = () => {
  const { isLoaded, user } = useUser();
  const { id } = useParams();

  const {
    loading: loadingJob,
    data: job,
    fn: fnJob,
  } = useFetch(getSingleJob, {
    job_id: id,
  });

  const { loading: loadingHiringStatus , fn: fnHiringStatus } = useFetch (
    updateHiringStatus,
    {
        job_id: id,
    }
  );

  const handleStatusChange = (value) => {
    const isOpen = value === "open"
    fnHiringStatus(isOpen).then(() => fnJob());
  }

  useEffect(() => {
    if (isLoaded) fnJob();
  }, [isLoaded]);

  if (!isLoaded || loadingJob) {
    return <BarLoader className="mb-4" width={"100%"} color="#36d7b7" />;
  }

  return (
    <div className="flex flex-col gap-8 mt-5">
      <div className="flex flex-col-reverse gap-6 md:flex-row justify-between items-center">
        <h1 className="gradient-title font-extrabold pb-3 text-4xl sm:text-6xl">
          {job?.title}
        </h1>
        <img src={job?.company?.logo_url} className="h-12" alt={job?.title} />
      </div>

      <div className="flex justify-between">
        <div className="flex gap-2">
          <MapPinIcon />
          {job?.location}
        </div>
        <div className="flex gap-2">
          <BriefcaseBusinessIcon />
          {job?.applications?.length} Applicants
        </div>
        <div className="flex gap-2">
          {job?.isOpen ? (
            <>
              <DoorOpen /> Open
            </>
          ) : (
            <>
              <DoorClosed /> Closed
            </>
          )}
        </div>
      </div>

      {/* Hiring status */}
      {!loadingHiringStatus && <BarLoader width={"100%"} color="#3gd7b7" />}
      {job?.recruiter_id === user?.id &&
        <Select onValueChange={handleStatusChange}>
                    <SelectTrigger
                        style={{
                            backgroundColor: job?.isOpen ? "#064e3b" : "#7f1d1d",
                        }}
                        className="w-full"
                    >
                        <SelectValue 
                        placeholder={
                            "Hiring Status" + (job?.isOpen ? "( Open )" : "( Closed )")
                        }
                        />
                    </SelectTrigger>
                    <SelectContent>
                                <SelectItem value="open">Open</SelectItem>
                                <SelectItem value="closed">Closed</SelectItem>
                    </SelectContent>
        </Select>
        }

      <h2 className="text-2xl sm:text-3xl font-bold">About the Job</h2>
      <p className="sm:text-lg">{job?.description}</p>

      <h2 className="text-2xl sm:text-3xl font-bold">What we are looking for</h2>
      <MDEditor.Markdown
        source={job?.requirements} className="bg-transparent sm:text-lg"
      />

      {/* Render Application */}

      {job?.recruiter_id !== user?.id && <ApplyJobDrawer 
      job = {job}
      user = {user}
      />} 

    </div>
  );
};

export default JobPage;
