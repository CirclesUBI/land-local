CREATE OR REPLACE FUNCTION add_seed_user (
    safe_address text
    , safe_owner_address text
    , user_name text
)
    RETURNS integer
    LANGUAGE plpgsql
AS $$
DECLARE
    invite_trigger_job_id integer;
    payload text;
    payload_hash text;
    profile_id integer;
    app_url text = 'https://o-platform.localhost/#/dashboard';
BEGIN
    payload = '{"id": "Invitation link for '||safe_address||'", "_kind": "perpetualTrigger", "_topic": "inviteCodeFromExternalTrigger", "_identity": "Invitation link for '||safe_address||'", "redirectUrl": "'||app_url||'", "inviterSafeAddress": "'|| safe_address ||'"}';
    payload_hash = encode(digest((payload::text||E'\n')::bytea, 'sha1'), 'hex');

    if exists(select 1 from "Profile" p where p."circlesAddress" = add_seed_user.safe_address) then
        return -1;
    end if;

    -- Add the invitation trigger
    INSERT INTO "Job" (
                        hash
                      , "createdAt"
                      , topic
                      , payload
                      , kind
                      , "timeoutAt"
    )
    VALUES (
               payload_hash
           , now()
           , 'invitecodefromexternaltrigger'
           , payload
           , 'perpetualTrigger'
           , null
           ) RETURNING id INTO invite_trigger_job_id;

    -- root user
    INSERT INTO public."Profile" (
        status,
        "circlesAddress",
        "circlesSafeOwner",
        "firstName",
        newsletter,
        "lastUpdateAt",
        "lastAcknowledged",
        "displayTimeCircles",
        type,
        "lastInvoiceNo",
        "lastRefundNo",
        "displayCurrency",
        "createdAt",
        "emailAddressVerified",
        "askedForEmailAddress",
        "inviteTriggerId")
    VALUES (   '',
               safe_address,
               safe_owner_address,
               user_name,
               true,
               now(),
               now(),
               true,
               'PERSON',
               0,
               0,
               'EURS',
               now(),
               true,
               true,
               invite_trigger_job_id
           ) RETURNING id INTO profile_id;

    INSERT INTO public."Invitation" ("createdByProfileId", "createdAt", code, "claimedByProfileId", "claimedAt", "redeemedByProfileId", "redeemedAt", key, address, name, "redeemTxHash", "fundedAt", "forSafeAddress")
    VALUES (1, now(), '', profile_id, now(), profile_id, now(), '0x00', '0x00', 'Root invitation', '0x00', now(), safe_address);

    INSERT INTO public."VerifiedSafe" ("safeAddress", "createdAt", "createdByProfileId", "createdByOrganisationId", "swapEoaAddress", "swapEoaKey", "inviteCount")
    VALUES (safe_address, now(), 1, 2, '0x00', '0x00', 1);

    RETURN profile_id;
END
$$;
