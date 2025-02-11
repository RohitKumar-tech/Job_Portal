import supabaseClient from "@/utils/supabase";

export async function getJobs(token) {
    const supabase = await supabaseClient(token);

    let { data, error } = await supabase.from("jobs").select("*");

    if (error) {
        console.error("Error fetching jobs:", error);
        return null;
    }

    return data;
}
