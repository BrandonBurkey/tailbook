# App Store listing: TailBook

The wording follows `validation/07-legal-and-appstore.md`. TailBook **tracks, organizes and reminds**. It never says an aircraft is airworthy, "legal to fly", FAA-approved or compliant. Have the lawyer read the description and the guarantee wording before submission.

## Name (30 max)

**TailBook: Aircraft Due Dates** (28)

## Subtitle (30 max)

**Annual, AD & inspection dates** (29)

## Keywords (100 max, comma-separated, no spaces)

```
maintenance,tracker,logbook,tach,hobbs,ELT,transponder,pitot,altimeter,VOR,squawk,FAR,plane,IFR
```
(95 characters.) Words already in the name and subtitle (aircraft, due, dates, annual, AD, inspection) are indexed automatically, so they aren't repeated. No manufacturer or competitor names (guideline 2.3.7 and trademark risk).

## Promotional text (170 max; editable without a new build)

> Know what's coming due on your aircraft: annual, transponder, pitot-static, ELT, ADs and more, each with its FAR citation. See your board free; try Pro for 14 days.

(164.) Out of season, you can swap in: "Annual season: hand your shop a work order with every open squawk and every item coming due."

## Description

```
Know what's coming due on your aircraft, in seconds.

TailBook turns the dates in your logbooks into a calm red / yellow / green status board for US Part 91 aircraft. Every item shows its FAR citation, the exact day it stays current through, and how many days or hours are left. One question at the top: "All items current?"

GET YOUR BOARD IN UNDER 5 MINUTES
• Enter your tail number, tach, and the dates you know. Skip anything you don't; it shows as "Needs info", never a guess.
• Annual (§91.409(a)), 100-hour for hire (§91.409(b)), altimeter & pitot-static (§91.411), transponder (§91.413), ELT inspection and battery (§91.207), VOR check (§91.171), registration (§47.40), and oil changes.
• Calendar-month items are tracked through the last day of the month, the way owners and IAs actually count them.

ADS AND RECURRING ITEMS
• Track recurring Airworthiness Directives and your own items by hours, calendar months, months, days, or whichever comes first.
• Keep the method of compliance and logbook page with each one.

LOG A FLIGHT IN ONE TAP
• A big "Log flight" button updates your tach. Or just say "Log tach time in TailBook" to Siri.
• Your real flying pace turns hours-based items into projected dates.

SQUAWKS AND REPORTS
• Note squawks as they happen.
• Annual Work Order PDF: open squawks plus everything coming due, ready to hand your shop.
• Aircraft Status Report PDF: every item, date and citation, for your A&P/IA, insurer or a buyer.

REMINDERS
• Get warned 60, 30 and 7 days before anything lapses.

PRIVATE BY DESIGN
• No account. No ads. No tracking. Your aircraft data stays on your device.

TAILBOOK PRO
Your board is free for one aircraft. TailBook Pro unlocks editing and marking items done, ADs and custom items, tach logging and Siri, squawks, PDF reports, reminders, and multiple aircraft.
• Annual: $199.99/year with a 14-day free trial for new subscribers.
• Monthly: $24.99/month.
Payment is charged to your Apple Account at confirmation of purchase. Subscriptions renew automatically unless cancelled at least 24 hours before the end of the current period. Manage or cancel any time in your Apple Account settings. Any unused portion of a free trial is forfeited when you buy a subscription.

IMPORTANT
TailBook is an organizational tool. It records and calculates dates and times from information you provide and displays reminders. TailBook does not inspect aircraft, does not determine airworthiness, and does not determine whether any Airworthiness Directive or other requirement applies to your aircraft. Your A&P mechanic or Inspection Authorization holder and the pilot in command are solely responsible for determining airworthiness (see 14 CFR 91.7, 91.403). Always verify against your aircraft's maintenance records and current regulations before flight. TailBook may contain errors.

Terms of Use: [TERMS URL]
Privacy Policy: [PRIVACY URL]
```

Before submitting, replace `[TERMS URL]` and `[PRIVACY URL]` with the same live URLs as in `AppConfig.swift`.

## What's New (1.0)

```
First release: status board with FAR citations, AD and recurring item tracker, one-tap tach log with Siri, squawks, Annual Work Order and Status Report PDFs, and 60/30/7-day reminders.
```

## App Review notes (paste into App Review Information → Notes)

```
Thank you for reviewing TailBook.

WHAT IT IS: an organizational tool for US private aircraft owners. Owners enter the dates of their inspections (annual, transponder, ELT, etc.) and TailBook calculates when each one comes due under the cited US regulation (14 CFR), shows a status board, and sends local reminders.

SAFETY / DISCLAIMER: TailBook does not inspect aircraft or determine airworthiness. The summary is deliberately worded "All items current?" (never "airworthy"). The disclaimer ("Your A&P/IA and the pilot in command determine airworthiness") must be accepted with "I understand" before setup, sits directly under the summary on the main screen, appears in Settings → About, and is printed on every page of the exported PDFs.

HOW TO TEST WITHOUT AN AIRCRAFT: no login is required. On the first screen tap "Explore a sample aircraft". That loads a clearly labeled demo aircraft (N182TB, "sample") with overdue, due-soon and current items, ADs and squawks.

SUBSCRIPTION: the board is free for one aircraft. A StoreKit paywall appears a few seconds after the board is first shown; you can also reach it by tapping any locked feature (e.g. "Log flight", or the ADs & Items tab). Products: com.tailbook.pro.annual ($199.99/yr, 14-day free trial) and com.tailbook.pro.monthly ($24.99/mo), in one subscription group. Restore Purchases and Redeem Code are on the paywall and in Settings.

PRIVACY: no accounts, no servers, no analytics, no third-party SDKs. All data is stored on the device with SwiftData. Notifications are local only.

SIRI: the App Shortcut "Log tach time in TailBook" records a tach reading (Pro).
```

## Screenshot captions (optional overlay text)

1. "All items current? Know in seconds."
2. "Every item cites its FAR."
3. "ADs by hours, months, or whichever first."
4. "Log a flight in one tap."
5. "Hand your shop an Annual Work Order."
6. "Warned 60, 30 and 7 days ahead."

Avoid "never fly illegal", "stay legal", "airworthy", "FAA-approved", "guaranteed compliance".
