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
INSERT INTO public."Profile"(status, "circlesAddress", "circlesSafeOwner", "firstName", "lastName", "avatarUrl", "avatarMimeType", "verifySafeChallenge", "newSafeAddress", "lastUpdateAt", "lastAcknowledged", "displayTimeCircles", type, "lastInvoiceNo", "lastRefundNo", "displayCurrency", "invoiceNoPrefix", "refundNoPrefix", "successorOfCirclesAddress", "createdAt", "verifyEmailChallenge", "askedForEmailAddress", "currentSimplePickupCodeRound", "lastSimplePickupCode", "largeBannerUrl", "smallBannerUrl", "productListingType", "inviteTriggerId", "confirmedLegalAge", age, gender, location, "businessCategoryId", "businessHoursFriday", "businessHoursMonday", "businessHoursSaturday", "businessHoursSunday", "businessHoursThursday", "businessHoursTuesday", "businessHoursWednesday", "phoneNumber", lat, lon, "locationName", "canInvite", "surveyDataSessionId", "shopEnabled")
    VALUES ('', lower(safe_address), lower(safe_owner_address), user_name, NULL, 'https://picsum.photos/200?random=' || lower(safe_owner_address), NULL, NULL, NULL, now(), now(), TRUE, 'ORGANISATION', 0, 0, 'EURS', 'I-', NULL, NULL, now(), NULL, TRUE, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, FALSE, NULL, TRUE)
RETURNING
    id INTO profile_id;
    RETURN profile_id;
END
$$;

