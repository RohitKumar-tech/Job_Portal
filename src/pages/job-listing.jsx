import { getCompanies } from "@/api/apiCompanies";
import { getJobs } from "@/api/apiJobs";
import JobCard from "@/components/job-card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import useFetch from "@/hooks/use-fetch";
import { useUser } from "@clerk/clerk-react";
import { Select, SelectContent, SelectGroup, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { State } from "country-state-city";
import { useEffect, useState } from "react";
import { BarLoader } from "react-spinners";
import {
  Pagination,
  PaginationContent,
  PaginationItem,
  PaginationLink,
  PaginationNext,
  PaginationPrevious,
} from "@/components/ui/pagination";

const JobListing = () => {
    const [searchQuery, setSearchQuery] = useState("");
    const [location, setLocation] = useState("");
    const [company_id, setCompany_id] = useState("");
    const [currentPage, setCurrentPage] = useState(1);
    const jobsPerPage = 6; // Show only 6 job cards per page

    const { isLoaded } = useUser();

    const {
        fn: fnJobs,
        data: jobs = [],
        loading: loadingJobs,
    } = useFetch(getJobs, { location, company_id, searchQuery });

    const {
        fn: fnCompanies,
        data: companies = [],
    } = useFetch(getCompanies);

    useEffect(() => {
        if (isLoaded) fnCompanies();
    }, [isLoaded]);

    useEffect(() => {
        if (isLoaded) fnJobs();
    }, [isLoaded, location, company_id, searchQuery]);

    const handleSearch = (e) => {
        e.preventDefault();
        let formData = new FormData(e.target);
        const query = formData.get("search-query");
        if (query) setSearchQuery(query);
    };

    const clearFilter = () => {
        setSearchQuery("");
        setCompany_id("");
        setLocation("");
        setCurrentPage(1);
    }

    if (!isLoaded) {
        return <BarLoader className="mb-4" width={"100%"} color="#36d7b7" />;
    }

    // Pagination logic
    const totalPages = Math.ceil(jobs.length / jobsPerPage);
    const startIndex = (currentPage - 1) * jobsPerPage;
    const endIndex = startIndex + jobsPerPage;
    const paginatedJobs = jobs.slice(startIndex, endIndex);

    const goToNextPage = () => {
        if (currentPage < totalPages) setCurrentPage((prev) => prev + 1);
    };

    const goToPrevPage = () => {
        if (currentPage > 1) setCurrentPage((prev) => prev - 1);
    };

    return (
        <div>
            <h1 className="gradient-title font-extrabold text-6xl sm:text-7xl text-center pb-8">
                Latest Jobs
            </h1>

            {/* Search Bar */}
            <form onSubmit={handleSearch} className="h-14 flex w-full gap-2 items-center mb-3">
                <Input 
                    type="text" 
                    placeholder="Search Jobs by Title.." 
                    name="search-query" 
                    className="h-full flex-1 px-4 text-md"
                />
                <Button type="submit" className="h-full sm:w-28" variant="blue">
                    Search
                </Button>
            </form>

            {/* Filters */}
            <div className="flex flex-col sm:flex-row gap-2">
                {/* Location Filter */}
                <Select value={location} onValueChange={(value) => setLocation(value)}>
                    <SelectTrigger>
                        <SelectValue placeholder="Filter by Location" />
                    </SelectTrigger>
                    <SelectContent className="z-50">
                        <SelectGroup>
                            {State.getStatesOfCountry("IN").map(({ name }) => (
                                <SelectItem key={name} value={name}>
                                    {name}
                                </SelectItem>
                            ))}
                        </SelectGroup>
                    </SelectContent>
                </Select>

                {/* Company Filter */}
                <Select value={company_id} onValueChange={(value) => setCompany_id(value)}>
                    <SelectTrigger>
                        <SelectValue placeholder="Filter by Company" />
                    </SelectTrigger>
                    <SelectContent className="z-50">
                        <SelectGroup>
                            {companies.length > 0 ? (
                                companies.map(({ name, id }) => (
                                    <SelectItem key={id} value={id}>
                                        {name}
                                    </SelectItem>
                                ))
                            ) : (
                                <SelectItem disabled>No Companies Found</SelectItem>
                            )}
                        </SelectGroup>
                    </SelectContent>
                </Select>

                <Button onClick={clearFilter} variant="destructive" className="sm:w-1/2">Clear Filter</Button>
            </div>

            {/* Loading State */}
            {loadingJobs && <BarLoader className="mt-4" width={"100%"} color="#36d7b7" />}

            {/* Job Listings */}
            {!loadingJobs && (
                <div className="mt-8 grid md:grid-cols-2 lg:grid-cols-3 gap-4">
                    {paginatedJobs.length > 0 ? (
                        paginatedJobs.map((job) => (
                            <JobCard key={job.id} job={job} savedInit={job?.saved?.length > 0} />
                        ))
                    ) : (
                        <div>No Jobs Found 🥹</div>
                    )}
                </div>
            )}

            {/* Pagination */}
            {totalPages > 1 && (
                <Pagination className="mt-6 flex justify-center">
                    <PaginationContent>
                        <PaginationItem>
                            <PaginationPrevious 
                                onClick={goToPrevPage} 
                                className={currentPage === 1 ? "opacity-50 cursor-not-allowed" : ""}
                            />
                        </PaginationItem>

                        {[...Array(totalPages)].map((_, index) => (
                            <PaginationItem key={index}>
                                <PaginationLink 
                                    onClick={() => setCurrentPage(index + 1)} 
                                    isActive={currentPage === index + 1}
                                >
                                    {index + 1}
                                </PaginationLink>
                            </PaginationItem>
                        ))}

                        <PaginationItem>
                            <PaginationNext 
                                onClick={goToNextPage} 
                                className={currentPage === totalPages ? "opacity-50 cursor-not-allowed" : ""}
                            />
                        </PaginationItem>
                    </PaginationContent>
                </Pagination>
            )}
        </div>
    );
};

export default JobListing;
