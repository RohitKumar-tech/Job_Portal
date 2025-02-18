import { Download } from "lucide-react";
import { Card, CardHeader, CardTitle } from "./ui/card";

const ApplicationCard = ({ application , isCandidate = false }) => {

    const handleDownload = () => {
        const link = document.createElement("a");
        link.href = application?.resume;
        link.target = "_blank";
        link.click();
    }

  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex justify-between font-bold">
          {isCandidate
            ? `${application?.job?.title} at ${application?.job?.company?.name}`
            : application?.name}
          <Download
            size={18}
            className="bg-white text-black rounded-full h-8 w-8 p-1.5 cursor-pointer"
            onClick={handleDownload}
          />
        </CardTitle>
      </CardHeader>

      {/* <CardContent>
        <div>
            
        </div>
      </CardContent> */}

    </Card>
  );
};

export default ApplicationCard