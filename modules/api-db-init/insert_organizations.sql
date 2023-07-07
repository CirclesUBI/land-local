CREATE OR REPLACE FUNCTION add_seed_org(safe_address text, safe_owner_address text, user_name text)
    RETURNS integer
    LANGUAGE plpgsql
    AS $$
DECLARE
    profile_id integer;
BEGIN
    IF EXISTS (
        SELECT
            1
        FROM
            "Profile" p
        WHERE
            p."circlesAddress" = lower(add_seed_org.safe_address)) THEN
    RETURN -1;
END IF;
INSERT INTO public."Profile"(status, "circlesAddress", "circlesSafeOwner", "firstName", "avatarUrl", "lastUpdateAt", "lastAcknowledged", "displayTimeCircles", type, "lastInvoiceNo", "lastRefundNo", "displayCurrency", "invoiceNoPrefix", "createdAt", "verifyEmailChallenge", "canInvite", "shopEnabled")
    VALUES ('', lower(safe_address), lower(safe_owner_address), user_name, 'https://picsum.photos/200?random=' || lower(safe_owner_address), now(), now(), TRUE, 'ORGANISATION', 0, 0, 'EURS', 'I-', now(), TRUE, FALSE, TRUE)
RETURNING
    id INTO profile_id;
    RETURN profile_id;
END
$$;

