---
id: domain-gallery
title: Domain Gallery
sidebar_label: Domain Gallery
slug: /examples/domain-gallery
---

# Domain Gallery

A visual gallery of AXAG-annotated UI patterns across industry domains. Each card shows the domain, the annotated element, and the resulting semantic manifest + MCP tool.

---

## 🛒 E-Commerce

### Product Search
```html
<input
  axag-intent="product.search"
  axag-entity="product"
  axag-action-type="read"
  axag-required-parameters='["query"]'
  axag-optional-parameters='["category","price_min","price_max","sort_by","page"]'
  axag-risk-level="none"
  axag-idempotent="true"
  axag-description="Search the product catalogue"
/>
```

**Manifest Intent:**
```json
{
  "intent": "product.search",
  "entity": "product",
  "action_type": "read",
  "operation_id": "product_search",
  "description": "Search the product catalogue",
  "required_parameters": [{ "name": "query", "type": "string" }],
  "optional_parameters": [
    { "name": "category", "type": "string" },
    { "name": "price_min", "type": "string" },
    { "name": "price_max", "type": "string" },
    { "name": "sort_by", "type": "string" },
    { "name": "page", "type": "string" }
  ]
}
```

**Generated MCP Tool:**
```json
{
  "name": "product_search",
  "description": "Search the product catalogue",
  "inputSchema": {
    "type": "object",
    "properties": {
      "query": { "type": "string" },
      "category": { "type": "string" },
      "price_min": { "type": "number" },
      "price_max": { "type": "number" },
      "sort_by": { "type": "string", "enum": ["relevance","price_asc","price_desc","rating"] },
      "page": { "type": "integer", "minimum": 1 }
    },
    "required": ["query"]
  }
}
```

---

### Add to Cart
```html
<button
  axag-intent="cart.add_item"
  axag-entity="cart"
  axag-action-type="write"
  axag-required-parameters='["product_id","quantity"]'
  axag-risk-level="low"
  axag-idempotent="false"
  axag-side-effects='["cart_updated"]'
  axag-description="Add a product to the shopping cart"
>Add to Cart</button>
```

---

### Place Order
```html
<button
  axag-intent="order.place"
  axag-entity="order"
  axag-action-type="write"
  axag-required-parameters='["cart_id","shipping_address_id","payment_method_id"]'
  axag-preconditions='["cart is not empty","payment method valid"]'
  axag-postconditions='["order created","payment charged","confirmation email sent"]'
  axag-risk-level="high"
  axag-confirmation-required="true"
  axag-idempotent="false"
  axag-side-effects='["payment","email","inventory_update"]'
  axag-description="Place an order and process payment"
>Place Order</button>
```

---

## 📈 Marketing

### Create Campaign
```html
<button
  axag-intent="campaign.create"
  axag-entity="campaign"
  axag-action-type="write"
  axag-required-parameters='["name","channel","audience_segment_id","budget"]'
  axag-optional-parameters='["start_date","end_date","content_template_id"]'
  axag-risk-level="medium"
  axag-confirmation-required="true"
  axag-idempotent="false"
  axag-side-effects='["campaign_draft_created"]'
  axag-description="Create a new marketing campaign"
>Create Campaign</button>
```

---

### Schedule Campaign
```html
<button
  axag-intent="campaign.schedule"
  axag-entity="campaign"
  axag-action-type="write"
  axag-required-parameters='["campaign_id","send_date"]'
  axag-preconditions='["campaign status is draft","audience assigned","content approved"]'
  axag-postconditions='["campaign scheduled","team notified"]'
  axag-risk-level="high"
  axag-confirmation-required="true"
  axag-idempotent="true"
  axag-side-effects='["notification"]'
  axag-scope="tenant"
  axag-description="Schedule a campaign for delivery"
>Schedule</button>
```

---

## 🤝 CRM

### Create Lead
```html
<button
  axag-intent="lead.create"
  axag-entity="lead"
  axag-action-type="write"
  axag-required-parameters='["first_name","last_name","email","company"]'
  axag-optional-parameters='["phone","source","notes"]'
  axag-risk-level="low"
  axag-idempotent="false"
  axag-side-effects='["lead_created","sales_rep_assigned"]'
  axag-description="Create a new sales lead"
>Add Lead</button>
```

---

### Progress Opportunity
```html
<button
  axag-intent="opportunity.advance_stage"
  axag-entity="opportunity"
  axag-action-type="write"
  axag-required-parameters='["opportunity_id",{"name":"new_stage","type":"string","enum":["qualification","proposal","negotiation","closed_won","closed_lost"]}]'
  axag-preconditions='["opportunity exists","stage transition valid"]'
  axag-postconditions='["pipeline updated","forecast recalculated"]'
  axag-risk-level="medium"
  axag-confirmation-required="true"
  axag-idempotent="true"
  axag-description="Move an opportunity to the next sales stage"
>Advance Stage</button>
```

---

## ✈️ Travel

### Search Flights
```html
<button
  axag-intent="flight.search"
  axag-entity="flight"
  axag-action-type="read"
  axag-required-parameters='["origin","destination","departure_date"]'
  axag-optional-parameters='["return_date","passengers","cabin_class","max_stops"]'
  axag-risk-level="none"
  axag-idempotent="true"
  axag-description="Search for available flights"
>Search Flights</button>
```

---

### Book Flight
```html
<button
  axag-intent="booking.create"
  axag-entity="booking"
  axag-action-type="write"
  axag-required-parameters='["flight_id","passenger_details","payment_method_id"]'
  axag-preconditions='["seats available","passenger details valid","payment method valid"]'
  axag-postconditions='["booking confirmed","e-ticket issued","confirmation email sent"]'
  axag-risk-level="high"
  axag-confirmation-required="true"
  axag-idempotent="false"
  axag-side-effects='["payment","email","seat_reservation"]'
  axag-description="Book a flight and issue tickets"
>Book Now</button>
```

---

## 💼 Jobs

### Apply for Job
```html
<button
  axag-intent="application.submit"
  axag-entity="application"
  axag-action-type="write"
  axag-required-parameters='["job_id","resume_id"]'
  axag-optional-parameters='["cover_letter","referral_code"]'
  axag-preconditions='["job posting is active","candidate has not already applied"]'
  axag-postconditions='["application submitted","recruiter notified","confirmation email sent"]'
  axag-risk-level="medium"
  axag-confirmation-required="true"
  axag-idempotent="false"
  axag-side-effects='["notification","email"]'
  axag-description="Submit a job application"
>Apply</button>
```

---

## 📊 Analytics

### Generate Report
```html
<button
  axag-intent="report.generate"
  axag-entity="report"
  axag-action-type="read"
  axag-required-parameters='["report_type","date_range_start","date_range_end"]'
  axag-optional-parameters='["dimensions","metrics","filters","format"]'
  axag-risk-level="none"
  axag-idempotent="true"
  axag-async="true"
  axag-scope="tenant"
  axag-description="Generate an analytics report"
>Generate Report</button>
```

---

### Export Dataset
```html
<button
  axag-intent="dataset.export"
  axag-entity="dataset"
  axag-action-type="read"
  axag-required-parameters='["dataset_id",{"name":"format","type":"string","enum":["csv","json","parquet","xlsx"]}]'
  axag-risk-level="none"
  axag-idempotent="false"
  axag-async="true"
  axag-scope="tenant"
  axag-description="Export a dataset for download"
>Export</button>
```

---

## 🎫 Support

### Create Ticket
```html
<button
  axag-intent="ticket.create"
  axag-entity="ticket"
  axag-action-type="write"
  axag-required-parameters='["subject","description",{"name":"priority","type":"string","enum":["low","medium","high","critical"]}]'
  axag-optional-parameters='["category","attachments"]'
  axag-risk-level="low"
  axag-idempotent="false"
  axag-side-effects='["ticket_created","support_team_notified"]'
  axag-description="Create a support ticket"
>Submit Ticket</button>
```

---

### Escalate Ticket
```html
<button
  axag-intent="ticket.escalate"
  axag-entity="ticket"
  axag-action-type="write"
  axag-required-parameters='["ticket_id","reason"]'
  axag-preconditions='["ticket status is open","not already escalated"]'
  axag-postconditions='["ticket priority raised","escalation manager notified"]'
  axag-risk-level="medium"
  axag-confirmation-required="true"
  axag-approval-required="true"
  axag-approval-roles='["support_lead"]'
  axag-idempotent="true"
  axag-side-effects='["notification"]'
  axag-description="Escalate a support ticket to a higher tier"
>Escalate</button>
```

---

## 🏢 Enterprise

### Admin — Delete User
```html
<button
  axag-intent="user.delete"
  axag-entity="user"
  axag-action-type="delete"
  axag-required-parameters='["user_id"]'
  axag-preconditions='["user has no active sessions","all data backed up"]'
  axag-postconditions='["user deactivated","sessions revoked","audit log entry created"]'
  axag-risk-level="critical"
  axag-confirmation-required="true"
  axag-approval-required="true"
  axag-approval-roles='["superadmin"]'
  axag-idempotent="true"
  axag-required-roles='["admin"]'
  axag-scope="tenant"
  axag-description="Permanently delete a user account"
>Delete User</button>
```

---

### Multi-Step Approval
```html
<!-- Step 1: Submit Request -->
<button
  axag-intent="access_request.submit"
  axag-entity="access_request"
  axag-action-type="write"
  axag-required-parameters='["resource_id","access_level","justification"]'
  axag-postconditions='["request submitted","first approver notified"]'
  axag-risk-level="medium"
  axag-confirmation-required="true"
  axag-idempotent="false"
  axag-description="Submit an access request"
>Request Access</button>

<!-- Step 2: Manager Approve -->
<button
  axag-intent="access_request.approve_manager"
  axag-entity="access_request"
  axag-action-type="write"
  axag-required-parameters='["request_id",{"name":"decision","type":"string","enum":["approve","reject"]},"comments"]'
  axag-preconditions='["request status is pending_manager"]'
  axag-postconditions='["manager decision recorded","compliance reviewer notified"]'
  axag-risk-level="high"
  axag-required-roles='["manager"]'
  axag-approval-required="true"
  axag-approval-roles='["manager"]'
  axag-idempotent="true"
  axag-description="Manager reviews and approves or rejects an access request"
>Approve / Reject</button>

<!-- Step 3: Compliance Approve -->
<button
  axag-intent="access_request.approve_compliance"
  axag-entity="access_request"
  axag-action-type="write"
  axag-required-parameters='["request_id",{"name":"decision","type":"string","enum":["approve","reject"]},"compliance_notes"]'
  axag-preconditions='["request status is pending_compliance","manager approved"]'
  axag-postconditions='["access provisioned","audit trail updated"]'
  axag-risk-level="critical"
  axag-required-roles='["compliance_officer"]'
  axag-approval-required="true"
  axag-approval-roles='["compliance_officer"]'
  axag-idempotent="true"
  axag-description="Compliance officer reviews and finalises an access request"
>Final Approval</button>
```

---

## Quick Reference Matrix

| Domain | Entity | Intents | Risk Range | Approval Needed |
|--------|--------|---------|-----------|-----------------|
| E-Commerce | product, cart, order | search, add, place | none → high | Order placement |
| Marketing | campaign | create, schedule | medium → high | Scheduling |
| CRM | lead, opportunity | create, advance | low → medium | Stage changes |
| Travel | flight, booking | search, create | none → high | Booking |
| Jobs | application | submit | medium | Submission |
| Analytics | report, dataset | generate, export | none | — |
| Support | ticket | create, escalate | low → medium | Escalation |
| Enterprise | user, access_request | delete, submit, approve | medium → critical | Multi-step |
