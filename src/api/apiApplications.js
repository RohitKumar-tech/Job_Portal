import supabaseClient, { supabaseUrl } from "@/utils/supabase";

export async function applyToJob(token , _ , jobData) {
    const supabase = await supabaseClient(token);

    const random = Math.floor(Math.random() * 90000);
    const fileName = `resume-${random}-${jobData.candidate_id}`;

    const {error:storageError} =  await supabase.storage
    .from('resumes')
    .upload(fileName , jobData.resume);

    if (storageError) {
        console.error("Error Uploading Resume : " , error);
        return null;
    }

    const resume = `${supabaseUrl}/storage/v1/object/public/resumes/${fileName}`;
  
      const { data, error } = await supabase
        .from("applications")
        .insert([
        {
            ...jobData,
            resume,
        }
        ])
        .select();
  
      if (error) {
        console.error("Error Submitting Application:", error);
        return null;
      }

      return data;
}