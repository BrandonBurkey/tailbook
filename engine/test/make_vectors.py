#!/usr/bin/env python3
"""
Generates engine/test-vectors.json, the golden file every TailBook engine
implementation (JavaScript today, Swift later) must pass.

The expected due dates / tach limits below are written BY HAND from the FAR
text, not copied from engine output. Day counts and projected dates are
computed here with Python's datetime, which is an implementation independent
of the JS engine, so the two cross-check each other.

    python3 engine/test/make_vectors.py      # rewrites engine/test-vectors.json
"""
import copy
import json
import math
import os
from datetime import date, timedelta

AS_OF = "2026-10-19"


def d(s):
    return date.fromisoformat(s)


def days(as_of, due):
    return (d(due) - d(as_of)).days


def projected(as_of, hours_left, avg_per_month):
    per_day = avg_per_month / (365.25 / 12)
    return (d(as_of) + timedelta(days=math.floor(hours_left / per_day))).isoformat()


# A complete, healthy VFR private aircraft: everything green on AS_OF.
BASE = {
    "asOf": AS_OF,
    "aircraft": {"ifr": False, "forHire": False, "currentTach": 1250.0, "avgHoursPerMonth": 10},
    "annual": {"lastDone": "2026-03-15"},
    "transponder": {"lastDone": "2025-05-10"},
    "eltInspection": {"lastDone": "2026-03-15"},
    "eltBattery": {"expires": "2028-01"},
    "registration": {"expires": "2029-06-30"},
}


def profile(**over):
    """BASE with overrides: `aircraft` is merged, other keys replaced, None deletes."""
    p = copy.deepcopy(BASE)
    for k, v in over.items():
        if v is None:
            p.pop(k, None)
        elif k == "aircraft":
            p[k].update(v)
        else:
            p[k] = v
    return p


def date_item(status, due, as_of=AS_OF, **extra):
    e = {"status": status, "dueDate": due, "daysRemaining": days(as_of, due)}
    e.update(extra)
    return e


cases = []


def case(cid, desc, prof, items=None, summary=None):
    exp = {}
    if items:
        exp["items"] = items
    if summary:
        exp["summary"] = summary
    cases.append({"id": cid, "description": desc, "profile": prof, "expect": exp})


# ---------------------------------------------------------------- baseline
case("base-healthy-vfr", "Complete healthy VFR private aircraft: everything green, IFR/hire items N/A.",
     profile(),
     {"annual": date_item("ok", "2027-03-31"),
      "transponder": date_item("ok", "2027-05-31"),
      "eltInspection": date_item("ok", "2027-03-31"),
      "eltBattery": date_item("ok", "2028-01-31"),
      "registration": date_item("ok", "2029-06-30"),
      "pitotStatic": {"status": "not_applicable"},
      "vorCheck": {"status": "not_applicable"},
      "hundredHour": {"status": "not_applicable"}},
     {"status": "current", "allCurrent": True,
      "nextDue": {"id": "annual", "date": "2027-03-31", "daysRemaining": days(AS_OF, "2027-03-31")}})

# ---------------------------------------------------------------- annual / calendar months
case("annual-first-of-month", "Annual done on the 1st of March: good through 31 March next year.",
     profile(annual={"lastDone": "2026-03-01"}), {"annual": date_item("ok", "2027-03-31")})
case("annual-last-of-month", "Annual done on 31 March: same due date as one done 1 March.",
     profile(annual={"lastDone": "2026-03-31"}), {"annual": date_item("ok", "2027-03-31")})
case("annual-jan31", "Annual done 31 January 2026: due through 31 January 2027.",
     profile(annual={"lastDone": "2026-01-31"}), {"annual": date_item("ok", "2027-01-31")})
case("annual-year-rollover", "Annual done mid-December: due 31 December the next year.",
     profile(annual={"lastDone": "2025-12-15"}), {"annual": date_item("ok", "2026-12-31")})
case("annual-due-soon", "Annual done 5 October 2025: due 31 Oct 2026, 12 days left => yellow.",
     profile(annual={"lastDone": "2025-10-05"}), {"annual": date_item("due_soon", "2026-10-31")},
     {"status": "current", "allCurrent": True})
case("annual-31-days-is-green", "Exactly 31 days left is green; 30 is the yellow threshold.",
     profile(asOf="2026-02-28", annual={"lastDone": "2025-03-10"}),
     {"annual": date_item("ok", "2026-03-31", "2026-02-28")})
case("annual-30-days-is-yellow", "Exactly 30 days left is yellow.",
     profile(asOf="2026-03-01", annual={"lastDone": "2025-03-10"}),
     {"annual": date_item("due_soon", "2026-03-31", "2026-03-01")})
case("annual-last-legal-day", "On the last day of the 12th calendar month the annual is still current (0 days, yellow).",
     profile(asOf="2027-03-31", annual={"lastDone": "2026-03-15"}, eltInspection={"lastDone": "2026-10-01"}),
     {"annual": date_item("due_soon", "2027-03-31", "2027-03-31")},
     {"status": "current", "allCurrent": True})
case("annual-day-after-expiry", "The day after the 12th calendar month ends the annual is overdue.",
     profile(asOf="2027-04-01", annual={"lastDone": "2026-03-15"}, eltInspection={"lastDone": "2026-10-01"}),
     {"annual": date_item("overdue", "2027-03-31", "2027-04-01")},
     {"status": "overdue", "allCurrent": False})
case("annual-feb29-done", "Annual done 29 Feb 2024 (leap day): due 28 Feb 2025, last legal day.",
     profile(asOf="2025-02-28", annual={"lastDone": "2024-02-29"}, transponder={"lastDone": "2024-06-01"},
             eltInspection={"lastDone": "2024-06-01"}),
     {"annual": date_item("due_soon", "2025-02-28", "2025-02-28")})
case("annual-feb29-day-after", "Annual done 29 Feb 2024: overdue on 1 March 2025.",
     profile(asOf="2025-03-01", annual={"lastDone": "2024-02-29"}, transponder={"lastDone": "2024-06-01"},
             eltInspection={"lastDone": "2024-06-01"}),
     {"annual": date_item("overdue", "2025-02-28", "2025-03-01")},
     {"status": "overdue", "allCurrent": False})
case("annual-due-on-leap-day", "Annual done Feb 2027: due through 29 Feb 2028 (leap year).",
     profile(asOf="2027-06-01", annual={"lastDone": "2027-02-10"}, eltInspection={"lastDone": "2027-02-10"}),
     {"annual": date_item("ok", "2028-02-29", "2027-06-01")})
case("annual-century-non-leap", "Annual done Feb 2099: due 28 Feb 2100 (2100 is not a leap year).",
     profile(asOf="2099-06-01", annual={"lastDone": "2099-02-15"}, eltInspection={"lastDone": "2099-02-15"},
             transponder={"lastDone": "2099-02-15"}, eltBattery={"expires": "2101-01"},
             registration={"expires": "2105-01-31"}),
     {"annual": date_item("ok", "2100-02-28", "2099-06-01")})
case("annual-missing", "No annual entered: item unknown and summary incomplete.",
     profile(annual=None), {"annual": {"status": "unknown"}},
     {"status": "incomplete", "allCurrent": None})
case("annual-future-date", "An annual dated after today is rejected as unknown.",
     profile(annual={"lastDone": "2026-11-02"}), {"annual": {"status": "unknown"}},
     {"status": "incomplete", "allCurrent": None})

# ---------------------------------------------------------------- pitot-static §91.411
case("pitot-not-ifr", "VFR-only aircraft: pitot-static N/A even with an old date entered.",
     profile(pitotStatic={"lastDone": "2019-01-01"}),
     {"pitotStatic": {"status": "not_applicable"}}, {"status": "current", "allCurrent": True})
case("pitot-ifr-due-soon", "IFR: pitot-static done 2 Oct 2024 is due 31 Oct 2026 (24 calendar months).",
     profile(aircraft={"ifr": True}, pitotStatic={"lastDone": "2024-10-02"}, vorCheck={"lastDone": "2026-10-10"}),
     {"pitotStatic": date_item("due_soon", "2026-10-31")})
case("pitot-ifr-overdue-limited", "IFR: pitot-static overdue: summary limited (IFR only), not overdue.",
     profile(aircraft={"ifr": True}, pitotStatic={"lastDone": "2024-09-30"}, vorCheck={"lastDone": "2026-10-10"}),
     {"pitotStatic": date_item("overdue", "2026-09-30")},
     {"status": "limited", "allCurrent": False, "affects": ["IFR operations"]})
case("pitot-jan31-24mo", "Pitot-static done 31 Jan 2025: due 31 Jan 2027.",
     profile(aircraft={"ifr": True}, pitotStatic={"lastDone": "2025-01-31"}, vorCheck={"lastDone": "2026-10-10"}),
     {"pitotStatic": date_item("ok", "2027-01-31")})
case("pitot-ifr-missing", "IFR aircraft without a pitot-static date: unknown, but only IFR is at stake so summary is current.",
     profile(aircraft={"ifr": True}, vorCheck={"lastDone": "2026-10-10"}),
     {"pitotStatic": {"status": "unknown"}}, {"status": "current", "allCurrent": True})

# ---------------------------------------------------------------- transponder §91.413
case("xpdr-feb29-24mo", "Transponder done 29 Feb 2024: due 28 Feb 2026; on that day 0 days left.",
     profile(asOf="2026-02-28", transponder={"lastDone": "2024-02-29"}, annual={"lastDone": "2025-06-01"},
             eltInspection={"lastDone": "2025-06-01"}),
     {"transponder": date_item("due_soon", "2026-02-28", "2026-02-28")})
case("xpdr-overdue-limited", "Transponder overdue: summary limited (transponder use).",
     profile(transponder={"lastDone": "2024-08-20"}),
     {"transponder": date_item("overdue", "2026-08-31")},
     {"status": "limited", "allCurrent": False})
case("xpdr-none-installed", "No transponder installed: N/A.",
     profile(aircraft={"hasTransponder": False}, transponder=None),
     {"transponder": {"status": "not_applicable"}}, {"status": "current", "allCurrent": True})

# ---------------------------------------------------------------- ELT §91.207
case("elt-insp-due-end-of-month", "ELT inspection done 31 Oct 2025: due 31 Oct 2026 (12 calendar months).",
     profile(eltInspection={"lastDone": "2025-10-31"}), {"eltInspection": date_item("due_soon", "2026-10-31")})
case("elt-insp-overdue", "ELT inspection overdue: summary overdue.",
     profile(eltInspection={"lastDone": "2025-09-01"}), {"eltInspection": date_item("overdue", "2026-09-30")},
     {"status": "overdue", "allCurrent": False})
case("elt-batt-month-only", "Battery date entered as month only (2027-03) means through 31 March 2027.",
     profile(eltBattery={"expires": "2027-03"}), {"eltBattery": date_item("ok", "2027-03-31")})
case("elt-batt-day-after", "Battery date was yesterday: overdue.",
     profile(eltBattery={"expires": "2026-10-18"}), {"eltBattery": date_item("overdue", "2026-10-18")},
     {"status": "overdue", "allCurrent": False})
case("elt-batt-30-days", "Battery replacement date exactly 30 days out: yellow.",
     profile(eltBattery={"expires": "2026-11-18"}), {"eltBattery": date_item("due_soon", "2026-11-18")})
case("elt-batt-31-days", "Battery replacement date 31 days out: green.",
     profile(eltBattery={"expires": "2026-11-19"}), {"eltBattery": date_item("ok", "2026-11-19")})
case("elt-batt-cumulative-use", "Transmitter used 1.2 cumulative hours: battery overdue regardless of date.",
     profile(eltBattery={"expires": "2028-01", "cumulativeUseHours": 1.2}),
     {"eltBattery": {"status": "overdue"}}, {"status": "overdue", "allCurrent": False})
case("elt-batt-exactly-one-hour", "Exactly 1.0 cumulative hour is not 'more than 1': still governed by date.",
     profile(eltBattery={"expires": "2028-01", "cumulativeUseHours": 1.0}),
     {"eltBattery": date_item("ok", "2028-01-31")})
case("elt-none-required", "Owner indicates no ELT required: inspection and battery N/A.",
     profile(aircraft={"hasElt": False}, eltInspection=None, eltBattery=None),
     {"eltInspection": {"status": "not_applicable"}, "eltBattery": {"status": "not_applicable"}},
     {"status": "current", "allCurrent": True})

# ---------------------------------------------------------------- VOR §91.171
case("vor-not-ifr", "VFR aircraft: VOR check N/A.", profile(vorCheck={"lastDone": "2020-01-01"}),
     {"vorCheck": {"status": "not_applicable"}})
case("vor-day-30", "VOR checked 19 Sep: still within the preceding 30 days on 19 Oct (last day).",
     profile(aircraft={"ifr": True}, pitotStatic={"lastDone": "2025-06-01"}, vorCheck={"lastDone": "2026-09-19"}),
     {"vorCheck": date_item("due_soon", "2026-10-19")}, {"status": "current", "allCurrent": True})
case("vor-day-31", "VOR checked 18 Sep: lapsed on 19 Oct; summary limited (IFR).",
     profile(aircraft={"ifr": True}, pitotStatic={"lastDone": "2025-06-01"}, vorCheck={"lastDone": "2026-09-18"}),
     {"vorCheck": date_item("overdue", "2026-10-18")},
     {"status": "limited", "allCurrent": False, "affects": ["IFR operations"]})
case("vor-gps-only", "IFR aircraft that does not use VOR for IFR navigation: N/A.",
     profile(aircraft={"ifr": True, "usesVor": False}, pitotStatic={"lastDone": "2025-06-01"}),
     {"vorCheck": {"status": "not_applicable"}})

# ---------------------------------------------------------------- registration §47.40
case("reg-from-issue", "Registration issued 10 Feb 2023 expires 28 Feb 2030 (7 years after last day of issue month).",
     profile(registration={"issued": "2023-02-10"}), {"registration": date_item("ok", "2030-02-28")})
case("reg-issued-leap-day", "Issued 29 Feb 2024: expires 28 Feb 2031.",
     profile(registration={"issued": "2024-02-29"}), {"registration": date_item("ok", "2031-02-28")})
case("reg-legacy-extended", "Issued Jan 2020 (3-year cert still valid on 23 Jan 2023) is extended to 31 Jan 2027.",
     profile(registration={"issued": "2020-01-15"}), {"registration": date_item("ok", "2027-01-31")})
case("reg-expired", "Registration expired 1 Oct 2026: summary overdue.",
     profile(registration={"expires": "2026-10-01"}), {"registration": date_item("overdue", "2026-10-01")},
     {"status": "overdue", "allCurrent": False})
case("reg-missing", "No registration entered: incomplete.",
     profile(registration=None), {"registration": {"status": "unknown"}}, {"status": "incomplete"})

# ---------------------------------------------------------------- 100-hour §91.409(b)
HIRE = {"forHire": True}
case("100h-not-for-hire", "Private use: 100-hour N/A even with tach entered.",
     profile(hundredHour={"lastDoneTach": 900}), {"hundredHour": {"status": "not_applicable"}})
case("100h-ok", "For hire: last 100-hr at 1200.0, tach 1250.0 => due 1300.0, 50 hrs left.",
     profile(aircraft=HIRE, hundredHour={"lastDoneTach": 1200}),
     {"hundredHour": {"status": "ok", "dueTach": 1300, "hoursRemaining": 50,
                      "projectedDate": projected(AS_OF, 50, 10)}})
case("100h-10-left", "Exactly 10.0 hrs left is yellow.",
     profile(aircraft={"forHire": True, "currentTach": 1290}, hundredHour={"lastDoneTach": 1200}),
     {"hundredHour": {"status": "due_soon", "dueTach": 1300, "hoursRemaining": 10}})
case("100h-10.1-left", "10.1 hrs left is green (floating-point safe).",
     profile(aircraft={"forHire": True, "currentTach": 1289.9}, hundredHour={"lastDoneTach": 1200}),
     {"hundredHour": {"status": "ok", "dueTach": 1300, "hoursRemaining": 10.1}})
case("100h-at-limit", "At exactly the due tach: 0 hrs left, still current (yellow).",
     profile(aircraft={"forHire": True, "currentTach": 1300}, hundredHour={"lastDoneTach": 1200}),
     {"hundredHour": {"status": "due_soon", "hoursRemaining": 0}}, {"status": "current"})
case("100h-in-overfly", "5.5 hrs over: overdue (for-hire operations), 4.5 hrs of ferry allowance left; summary limited.",
     profile(aircraft={"forHire": True, "currentTach": 1305.5}, hundredHour={"lastDoneTach": 1200}),
     {"hundredHour": {"status": "overdue", "hoursRemaining": -5.5, "overflyHoursRemaining": 4.5}},
     {"status": "limited", "allCurrent": False, "affects": ["For-hire operations"]})
case("100h-beyond-overfly", "11 hrs over: beyond the 10-hr allowance.",
     profile(aircraft={"forHire": True, "currentTach": 1311}, hundredHour={"lastDoneTach": 1200}),
     {"hundredHour": {"status": "overdue", "hoursRemaining": -11, "overflyHoursRemaining": 0}})
case("100h-overfly-carried", "Last done at 1306 against a 1300 limit: the 6 hrs count, so next due 1400 not 1406.",
     profile(aircraft={"forHire": True, "currentTach": 1350}, hundredHour={"lastDoneTach": 1306, "previousDueTach": 1300}),
     {"hundredHour": {"status": "ok", "dueTach": 1400, "hoursRemaining": 50}})
case("100h-overfly-carried-yellow", "Carried excess makes it yellow sooner: due 1400, tach 1392 => 8 left.",
     profile(aircraft={"forHire": True, "currentTach": 1392}, hundredHour={"lastDoneTach": 1306, "previousDueTach": 1300}),
     {"hundredHour": {"status": "due_soon", "dueTach": 1400, "hoursRemaining": 8}})
case("100h-done-early", "Done early at 1290 (limit 1300): no credit, next due 1390.",
     profile(aircraft={"forHire": True, "currentTach": 1350}, hundredHour={"lastDoneTach": 1290, "previousDueTach": 1300}),
     {"hundredHour": {"status": "ok", "dueTach": 1390, "hoursRemaining": 40}})
case("100h-annual-resets", "An annual at tach 1320 (later than the 100-hr at 1290) satisfies §91.409(b): due 1420.",
     profile(aircraft={"forHire": True, "currentTach": 1350},
             annual={"lastDone": "2026-03-15", "tach": 1320}, hundredHour={"lastDoneTach": 1290}),
     {"hundredHour": {"status": "ok", "dueTach": 1420, "hoursRemaining": 70}})
case("100h-no-current-tach", "For hire without current tach: unknown.",
     profile(aircraft={"forHire": True, "currentTach": None}, hundredHour={"lastDoneTach": 1200}),
     {"hundredHour": {"status": "unknown"}})

# ---------------------------------------------------------------- oil change (advisory)
case("oil-hours-projected", "Oil every 50 hrs: last 1210, tach 1250 => 10 left (yellow), projected from 10 hrs/month.",
     profile(oilChange={"lastDoneTach": 1210, "intervalHours": 50}),
     {"oilChange": {"status": "due_soon", "dueTach": 1260, "hoursRemaining": 10,
                    "projectedDate": projected(AS_OF, 10, 10),
                    "effectiveDate": projected(AS_OF, 10, 10), "governedBy": "hours"}},
     {"status": "current",
      "nextDue": {"id": "oilChange", "date": projected(AS_OF, 10, 10),
                  "daysRemaining": days(AS_OF, projected(AS_OF, 10, 10))}})
case("oil-whichever-first-calendar", "Oil 50 hrs or 4 months: 4 months from 19 Jun is today; calendar governs.",
     profile(oilChange={"lastDoneTach": 1240, "lastDoneDate": "2026-06-19", "intervalHours": 50, "intervalMonths": 4}),
     {"oilChange": {"status": "due_soon", "dueDate": "2026-10-19", "daysRemaining": 0, "dueTach": 1290,
                    "hoursRemaining": 40, "governedBy": "date", "effectiveDate": "2026-10-19"}})
case("oil-overdue-advisory", "Oil overdue by hours is flagged but does not change the summary.",
     profile(oilChange={"lastDoneTach": 1190, "intervalHours": 50}),
     {"oilChange": {"status": "overdue", "hoursRemaining": -10}},
     {"status": "current", "allCurrent": True, "attention": ["oilChange"]})

# ---------------------------------------------------------------- ADs §39.7
case("ad-hours-overdue", "Recurring 100-hr AD last done at 1140, tach 1250: overdue, summary overdue.",
     profile(ads=[{"adNumber": "2011-10-09", "intervalHours": 100, "lastDoneTach": 1140}]),
     {"ad:2011-10-09": {"status": "overdue", "dueTach": 1240, "hoursRemaining": -10}},
     {"status": "overdue", "allCurrent": False})
case("ad-whichever-first-hours", "AD 100 hrs or 12 calendar months: hours come first (5 left) => yellow, governed by hours.",
     profile(aircraft={"currentTach": 1245},
             ads=[{"adNumber": "2020-18-04", "intervalHours": 100, "intervalCalendarMonths": 12,
                   "lastDoneTach": 1150, "lastDoneDate": "2026-01-10"}]),
     {"ad:2020-18-04": {"status": "due_soon", "dueTach": 1250, "hoursRemaining": 5, "dueDate": "2027-01-31",
                        "daysRemaining": days(AS_OF, "2027-01-31"), "governedBy": "hours",
                        "effectiveDate": projected(AS_OF, 5, 10)}})
case("ad-whichever-first-calendar", "AD 500 hrs or 12 calendar months: calendar lapsed 31 Aug 2026 though hours remain.",
     profile(ads=[{"adNumber": "2019-05-12", "intervalHours": 500, "intervalCalendarMonths": 12,
                   "lastDoneTach": 1150, "lastDoneDate": "2025-08-15"}]),
     {"ad:2019-05-12": {"status": "overdue", "dueDate": "2026-08-31", "dueTach": 1650, "governedBy": "date"}},
     {"status": "overdue"})
case("ad-plain-months-anniversary", "AD every 1 month (plain months) from 31 Jan: due 28 Feb (anniversary, clamped).",
     profile(asOf="2026-02-15", annual={"lastDone": "2025-06-01"}, transponder={"lastDone": "2025-06-01"},
             eltInspection={"lastDone": "2025-06-01"},
             ads=[{"adNumber": "2024-01-01", "intervalMonths": 1, "lastDoneDate": "2026-01-31"}]),
     {"ad:2024-01-01": date_item("due_soon", "2026-02-28", "2026-02-15")})
case("ad-days-interval", "AD every 90 days from 1 Aug 2026: due 30 Oct 2026.",
     profile(ads=[{"adNumber": "2025-07-07", "intervalDays": 90, "lastDoneDate": "2026-08-01"}]),
     {"ad:2025-07-07": date_item("due_soon", "2026-10-30")})
case("ad-one-time-complied", "One-time AD complied with: OK.",
     profile(ads=[{"adNumber": "2018-08-01", "recurring": False, "complied": True, "lastDoneDate": "2019-04-02"}]),
     {"ad:2018-08-01": {"status": "ok"}}, {"status": "current"})
case("ad-one-time-explicit-due", "One-time AD not yet done, compliance required by 1 Nov 2026.",
     profile(ads=[{"adNumber": "2026-12-03", "recurring": False, "dueDate": "2026-11-01"}]),
     {"ad:2026-12-03": date_item("due_soon", "2026-11-01")})
case("ad-not-applicable", "AD marked not applicable by the IA: N/A.",
     profile(ads=[{"adNumber": "2010-01-01", "applicable": False}]),
     {"ad:2010-01-01": {"status": "not_applicable"}}, {"status": "current"})
case("ad-whichever-first-missing-tach", "Whichever-first AD with the hours side missing cannot be called OK.",
     profile(ads=[{"adNumber": "2022-02-02", "intervalHours": 100, "intervalCalendarMonths": 12,
                   "lastDoneDate": "2026-05-01"}]),
     {"ad:2022-02-02": {"status": "unknown", "dueDate": "2027-05-31"}}, {"status": "incomplete"})

# ---------------------------------------------------------------- custom items
case("custom-advisory-overdue", "Owner custom item (6 calendar months) overdue: attention only.",
     profile(customItems=[{"id": "fire-ext", "name": "Fire extinguisher check", "intervalCalendarMonths": 6,
                           "lastDoneDate": "2026-03-20"}]),
     {"custom:fire-ext": date_item("overdue", "2026-09-30")},
     {"status": "current", "attention": ["custom:fire-ext"]})
case("custom-regulatory-overdue", "Custom item flagged regulatory (e.g. an STC ICA limit) overdue: summary overdue.",
     profile(customItems=[{"id": "caps", "name": "CAPS repack", "regulatory": True, "intervalCalendarMonths": 120,
                           "lastDoneDate": "2016-09-01"}]),
     {"custom:caps": date_item("overdue", "2026-09-30")}, {"status": "overdue"})

# ---------------------------------------------------------------- summaries
case("summary-multi-limited", "IFR + hire with pitot-static and 100-hr overdue: summary limited, affects two.",
     profile(aircraft={"ifr": True, "forHire": True, "currentTach": 1302}, pitotStatic={"lastDone": "2024-08-01"},
             vorCheck={"lastDone": "2026-10-10"}, hundredHour={"lastDoneTach": 1200}),
     {"pitotStatic": {"status": "overdue"}, "hundredHour": {"status": "overdue"}},
     {"status": "limited", "allCurrent": False,
      "affects": ["For-hire operations", "IFR operations"]})
case("summary-every-flight-item-wins", "Annual overdue plus IFR item overdue: summary overdue.",
     profile(aircraft={"ifr": True}, annual={"lastDone": "2025-09-01"}, pitotStatic={"lastDone": "2024-08-01"},
             vorCheck={"lastDone": "2026-10-10"}),
     {"annual": date_item("overdue", "2026-09-30")}, {"status": "overdue", "allCurrent": False})
case("summary-next-due", "IFR aircraft: next due is the VOR check in 6 days.",
     profile(aircraft={"ifr": True}, pitotStatic={"lastDone": "2025-06-01"}, vorCheck={"lastDone": "2026-09-25"}),
     {"vorCheck": date_item("due_soon", "2026-10-25")},
     {"status": "current", "nextDue": {"id": "vorCheck", "date": "2026-10-25", "daysRemaining": 6}})

cases = [c for c in cases if c]
ids = [c["id"] for c in cases]
assert len(ids) == len(set(ids)), "duplicate case id"

# ---------------------------------------------------------------- pure date functions
date_cases = [
    ("endOfCalendarMonths", ["2026-03-01", 12], "2027-03-31"),
    ("endOfCalendarMonths", ["2026-03-31", 12], "2027-03-31"),
    ("endOfCalendarMonths", ["2026-01-31", 1], "2026-02-28"),
    ("endOfCalendarMonths", ["2027-01-31", 1], "2027-02-28"),
    ("endOfCalendarMonths", ["2028-01-15", 1], "2028-02-29"),
    ("endOfCalendarMonths", ["2024-02-29", 12], "2025-02-28"),
    ("endOfCalendarMonths", ["2024-02-29", 24], "2026-02-28"),
    ("endOfCalendarMonths", ["2024-02-29", 48], "2028-02-29"),
    ("endOfCalendarMonths", ["2025-12-15", 12], "2026-12-31"),
    ("endOfCalendarMonths", ["2025-11-30", 2], "2026-01-31"),
    ("endOfCalendarMonths", ["2023-02-10", 84], "2030-02-28"),
    ("endOfCalendarMonths", ["2099-02-01", 12], "2100-02-28"),
    ("endOfCalendarMonths", ["1999-02-01", 12], "2000-02-29"),
    ("addMonthsClamped", ["2026-01-31", 1], "2026-02-28"),
    ("addMonthsClamped", ["2028-01-31", 1], "2028-02-29"),
    ("addMonthsClamped", ["2026-03-31", 1], "2026-04-30"),
    ("addMonthsClamped", ["2026-06-19", 4], "2026-10-19"),
    ("addMonthsClamped", ["2026-10-31", -6], "2026-04-30"),
    ("addDays", ["2026-09-19", 30], "2026-10-19"),
    ("addDays", ["2028-02-28", 1], "2028-02-29"),
    ("addDays", ["2026-12-31", 1], "2027-01-01"),
    ("daysBetween", ["2026-10-19", "2027-03-31"], days("2026-10-19", "2027-03-31")),
    ("daysBetween", ["2027-04-01", "2027-03-31"], -1),
    ("daysBetween", ["2028-02-01", "2028-03-01"], 29),
    ("normalizeDate", ["2027-03"], "2027-03-31"),
    ("normalizeDate", ["2028-02"], "2028-02-29"),
]
# cross-check the hand-written date answers against Python where we can
for fn, args, exp in date_cases:
    if fn == "addDays":
        assert (d(args[0]) + timedelta(days=args[1])).isoformat() == exp, (fn, args)

out = {
    "schema": 1,
    "engineVersion": "1.0.0",
    "generatedBy": "engine/test/make_vectors.py",
    "description": "Golden test vectors for the TailBook due-date engine. Every implementation (JS, Swift) must "
                   "produce these values. Only the fields listed under expect are compared; omitted fields are "
                   "not constrained. Dates are civil dates (YYYY-MM-DD); hours are tach hours to 0.1.",
    "conventions": {
        "calendarMonths": "Due through the last day of the Nth month after the month done.",
        "days": "Done on D with an N-day interval: last current day is D+N.",
        "plainMonths": "Same day-of-month N months later, clamped to the month's last day.",
        "dueSoon": "<= 30 days or <= 10.0 hours remaining; 0 remaining is still current.",
        "projection": "floor(hoursRemaining / (avgHoursPerMonth / (365.25/12))) days after asOf.",
        "summaryOrder": "overdue (scope all) > incomplete > limited (ifr/hire/transponder only) > current. The summary reports whether entered items are current; it is never an airworthiness determination.",
        "itemOrder": "annual, hundredHour, pitotStatic, transponder, eltInspection, eltBattery, vorCheck, registration, oilChange, ads[], customItems[]. affects[] and attention[] follow this order; nextDue ties go to the earlier item.",
    },
    "dateCases": [{"fn": fn, "args": args, "expect": exp} for fn, args, exp in date_cases],
    "cases": cases,
}

path = os.path.join(os.path.dirname(__file__), "..", "test-vectors.json")
with open(path, "w") as f:
    json.dump(out, f, indent=2, ensure_ascii=False)
    f.write("\n")
print(f"wrote {len(cases)} cases + {len(date_cases)} date cases to {os.path.normpath(path)}")
