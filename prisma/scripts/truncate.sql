DO $$ DECLARE
    row RECORD;
BEGIN
    FOR row IN (SELECT tablename FROM pg_tables WHERE schemaname = 'public') LOOP
        EXECUTE 'TRUNCATE TABLE ' || quote_ident(row.tablename) || ' CASCADE';
    END LOOP;
END $$;