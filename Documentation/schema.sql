CREATE TABLE companies (
    id SERIAL PRIMARY KEY,
    created_at TIMESTAMPTZ DEFAULT CURRENT_TIMESTAMP,
    name TEXT NOT NULL,
    logo_url TEXT
);

CREATE TABLE jobs (
    id SERIAL PRIMARY KEY,
    created_at TIMESTAMPTZ DEFAULT CURRENT_TIMESTAMP,
    recruiter_id TEXT NOT NULL,
    title TEXT NOT NULL,
    company_id INT NOT NULL,
    description TEXT,
    location TEXT,
    requirements TEXT,
    isOpen BOOLEAN DEFAULT TRUE,
    FOREIGN KEY (company_id) REFERENCES companies(id) ON DELETE CASCADE
);

CREATE TABLE applications (
    id SERIAL PRIMARY KEY,
    created_at TIMESTAMPTZ DEFAULT CURRENT_TIMESTAMP,
    job_id INT NOT NULL,
    candidate_id TEXT NOT NULL,
    status TEXT CHECK (status IN ('pending', 'accepted', 'rejected')),
    resume TEXT,
    skills TEXT,
    experience TEXT,
    education TEXT,
    name TEXT,
    FOREIGN KEY (job_id) REFERENCES jobs(id) ON DELETE CASCADE
);

CREATE TABLE saved_jobs (
    id SERIAL PRIMARY KEY,
    created_at TIMESTAMPTZ DEFAULT CURRENT_TIMESTAMP,
    user_id TEXT NOT NULL,
    job_id INT NOT NULL,
    FOREIGN KEY (job_id) REFERENCES jobs(id) ON DELETE CASCADE
);
