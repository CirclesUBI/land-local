CREATE OR REPLACE FUNCTION add_seed_org (
    safe_address text
    , safe_owner_address text
    , user_name text)
    RETURNS integer
    LANGUAGE plpgsql
AS $$
DECLARE
    profile_id integer;
BEGIN
    if exists(select 1 from "Profile" p where p."circlesAddress" = add_seed_org.safe_address) then
        return -1;
    end if;

    INSERT INTO public."Profile" (status, "circlesAddress", "circlesSafeOwner", "firstName", "lastName", "avatarUrl",
                                  "avatarMimeType", "verifySafeChallenge", "newSafeAddress", "lastUpdateAt", "lastAcknowledged",
                                  "displayTimeCircles", type, "lastInvoiceNo", "lastRefundNo", "displayCurrency", "invoiceNoPrefix",
                                  "refundNoPrefix", "successorOfCirclesAddress", "createdAt", "verifyEmailChallenge", "askedForEmailAddress",
                                  "currentSimplePickupCodeRound", "lastSimplePickupCode", "largeBannerUrl", "smallBannerUrl",
                                  "productListingType", "inviteTriggerId", "shopEnabled", "confirmedLegalAge", age, gender, location,
                                  "businessCategoryId", "businessHoursFriday", "businessHoursMonday", "businessHoursSaturday",
                                  "businessHoursSunday", "businessHoursThursday", "businessHoursTuesday", "businessHoursWednesday",
                                  "phoneNumber", lat, lon, "locationName", "canInvite", "surveyDataSessionId")
    VALUES ('', safe_address, safe_owner_address, user_name, null, null, null, null, null, now(), now(), true, 'ORGANISATION', 0, 0,
            'EURS', 'I-', null, null, now(), null, true, null, null, null, null, null, null, null, null, null, null,
            null, null, null, null, null, null, null, null, null, null, null, null, null, false, null) RETURNING id INTO profile_id;

    RETURN profile_id;
END
$$;
