-- Add semester column to mahasiswa table
ALTER TABLE mahasiswa 
ADD COLUMN IF NOT EXISTS semester INTEGER NOT NULL DEFAULT 1;

-- Add comment for documentation
COMMENT ON COLUMN mahasiswa.semester IS 'Semester mahasiswa saat ini (1-14)';

-- Add check constraint to ensure semester is between 1 and 14
ALTER TABLE mahasiswa 
ADD CONSTRAINT mahasiswa_semester_check 
CHECK (semester >= 1 AND semester <= 14);

-- Create index for faster queries
CREATE INDEX IF NOT EXISTS idx_mahasiswa_semester 
ON mahasiswa(semester);

