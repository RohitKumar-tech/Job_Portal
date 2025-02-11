import { getJobs } from "@/api/apiJobs";
import { useSession } from "@clerk/clerk-react";
import { useEffect } from "react";

const JobListing = () => {
    const { session } = useSession();

    const fetchJobs = async () => {
        const supabaseAccessToken = await session.getToken({
            template: "supabase",
        })

        const data = await getJobs(supabaseAccessToken);

        console.log(data);
    };

    useEffect(() => {
        fetchJobs();
    } , [session]);

    return <div>JobListing</div>;
}

export default JobListing;