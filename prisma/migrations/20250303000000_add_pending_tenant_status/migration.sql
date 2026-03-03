-- Add PENDING to TenantStatus enum (for self-registration approval flow)
DO $$
BEGIN
    IF NOT EXISTS (
        SELECT 1 FROM pg_enum
        WHERE enumlabel = 'PENDING'
        AND enumtypid = (SELECT oid FROM pg_type WHERE typname = 'TenantStatus')
    ) THEN
        ALTER TYPE "TenantStatus" ADD VALUE 'PENDING';
    END IF;
END
$$;
