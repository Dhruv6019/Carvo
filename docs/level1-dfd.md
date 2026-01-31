# Car Modification System - Level 1 Data Flow Diagrams

## Level 1: Admin Module

```
                         login_credentials                    login_credentials
        ┌───────────────────────────────────────────►   ┌─────────┐   ────────────────────────────────────────────►  ──────────────
        │                Acknowledgement             │         │           Acknowledgement                      admin
        │         ◄───────────────────────────────────   │  Login  │   ◄───────────────────────────────────        ──────────────
        │                                            │   1.0   │
        │                                            └─────────┘
        │
        │         user_management                        user_management
        │    ────────────────────────────────────────────►   ┌─────────┐   ────────────────────────────────────────────►  ──────────────
        │                User_Reports                   │         │           User_Reports                        user
        │    ◄────────────────────────────────────────────   │ Manage  │   ◄────────────────────────────────────────────    ──────────────
        │                                               │employee │
        │                                               │   2.0   │
        │                                               └─────────┘
        │                                                    ▲ │
        │                                                    │ │
        │                                                    │ ▼
   ┌────▼────┐                                         registration_details    account_status
   │         │                                              │                      │
   │  ADMIN  │          system_config                       │                      ▼
   │         │    ────────────────────────────────────────────►   ┌─────────┐               ──────────────
   │         │                Config_Status                │         │                   customer
   │         │    ◄────────────────────────────────────────────   │ Manage  │               ──────────────
   └────┬────┘                                            │ System  │
        │                                                 │   3.0   │
        │                                                 └─────────┘
        │
        │         catalog_management                         catalog_management
        │    ────────────────────────────────────────────►   ┌─────────┐   ────────────────────────────────────────────►  ──────────────
        │                Catalog_Status                   │         │           Catalog_Status                      catalog
        │    ◄────────────────────────────────────────────   │ Manage  │   ◄────────────────────────────────────────────    ──────────────
        │                                               │Catalog  │
        │                                               │   4.0   │
        │                                               └─────────┘
        │
        │         order_supervision                          escalated_issues
        │    ────────────────────────────────────────────►   ┌─────────┐   ◄────────────────────────────────────────────    ──────────────
        │                Order_Reports                    │         │           resolution_guidance                 support_agent
        └    ◄────────────────────────────────────────────   │ Manage  │   ────────────────────────────────────────────►    ──────────────
                                                         │ Orders  │
                                                         │   5.0   │
                                                         └─────────┘
```

## Level 1: Customer Module

```
                         login_credentials                    login_credentials
        ┌───────────────────────────────────────────►   ┌─────────┐   ────────────────────────────────────────────►  ──────────────
        │                Acknowledgement             │         │           Acknowledgement                      customer
        │         ◄───────────────────────────────────   │  Login  │   ◄───────────────────────────────────        ──────────────
        │                                            │   1.0   │
        │                                            └─────────┘
        │
        │         registration_details                   account_approval
        │    ────────────────────────────────────────────►   ┌─────────┐   ◄────────────────────────────────────────────    ──────────────
        │                Registration_Confirmation      │         │           account_status                       admin
        │    ◄────────────────────────────────────────────   │Register │   ────────────────────────────────────────────►    ──────────────
        │                                               │   2.0   │
        │                                               └─────────┘
        │
        │         car_information                        car_information
        │    ────────────────────────────────────────────►   ┌─────────┐   ────────────────────────────────────────────►  ──────────────
        │                Car_Status                      │         │           Car_Status                          car_data
        │    ◄────────────────────────────────────────────   │ Manage  │   ◄────────────────────────────────────────────    ──────────────
   ┌────▼────┐                                          │  Cars   │
   │         │                                          │   3.0   │
   │CUSTOMER │                                          └─────────┘
   │         │                                               │
   │         │        modification_requests                  │ parts_inquiry                 parts_availability
   │         │    ────────────────────────────────────────────►   ┌─────────┐   ────────────────────────────────────────────►  ──────────────
   │         │                Custom_Design                │         │   ◄────────────────────────────────────────────    seller
   └────┬────┘    ◄────────────────────────────────────────────   │  Build  │                                             ──────────────
        │                                                   │  Mods   │
        │                                                   │   4.0   │
        │                                                   └─────────┘
        │
        │         order_placement                           service_request
        │    ────────────────────────────────────────────►   ┌─────────┐   ────────────────────────────────────────────►  ──────────────
        │                Order_Confirmation               │         │   ◄────────────────────────────────────────────  service_provider
        │    ◄────────────────────────────────────────────   │ Process │           appointment_slots                    ──────────────
        │                                               │ Orders  │
        │                                               │   5.0   │
        │                                               └─────────┘
        │
        │         payment_information                       payment_information
        │    ────────────────────────────────────────────►   ┌─────────┐   ────────────────────────────────────────────►  ──────────────
        │                Payment_Confirmation             │         │           Payment_Confirmation                 payment
        │    ◄────────────────────────────────────────────   │ Process │   ◄────────────────────────────────────────────    ──────────────
        │                                               │Payments │
        │                                               │   6.0   │
        │                                               └─────────┘
        │
        │         gallery_uploads                           support_tickets
        │    ────────────────────────────────────────────►   ┌─────────┐   ────────────────────────────────────────────►  ──────────────
        │                Gallery_Confirmation             │         │   ◄────────────────────────────────────────────  support_agent
        └    ◄────────────────────────────────────────────   │Customer │           assistance                           ──────────────
                                                         │Support  │
                                                         │   7.0   │
                                                         └─────────┘
```

## Level 1: Seller Module

```
                         login_credentials                    login_credentials
        ┌───────────────────────────────────────────►   ┌─────────┐   ────────────────────────────────────────────►  ──────────────
        │                Acknowledgement             │         │           Acknowledgement                      seller
        │         ◄───────────────────────────────────   │  Login  │   ◄───────────────────────────────────        ──────────────
        │                                            │   1.0   │
        │                                            └─────────┘
        │
        │         business_registration                 vendor_approval
        │    ────────────────────────────────────────────►   ┌─────────┐   ◄────────────────────────────────────────────    ──────────────
        │                Registration_Status            │         │           approval_status                       admin
        │    ◄────────────────────────────────────────────   │Register │   ────────────────────────────────────────────►    ──────────────
        │                                               │   2.0   │
        │                                               └─────────┘
        │
        │         inventory_updates                      inventory_updates
        │    ────────────────────────────────────────────►   ┌─────────┐   ────────────────────────────────────────────►  ──────────────
        │                Inventory_Status               │         │           Inventory_Status                     inventory
        │    ◄────────────────────────────────────────────   │ Manage  │   ◄────────────────────────────────────────────    ──────────────
   ┌────▼────┐                                          │Inventory│
   │         │                                          │   3.0   │
   │ SELLER  │                                          └─────────┘
   │         │                                               │
   │         │        order_confirmations          modification_requests    order_details
   │         │    ────────────────────────────────────────────►   ┌─────────┐   ────────────────────────────────────────────►  ──────────────
   │         │                Order_Status                 │         │   ◄────────────────────────────────────────────    customer
   └────┬────┘    ◄────────────────────────────────────────────   │ Manage  │                                             ──────────────
        │                                                   │ Orders  │
        │                                                   │   4.0   │     shipping_requests
        │                                                   └─────────┘   ────────────────────────────────────────────►  ──────────────
        │                                                        │       ◄────────────────────────────────────────────  delivery_supplier
        │                                                        │                delivery_confirmation               ──────────────
        │         parts_coordination                             │
        │    ────────────────────────────────────────────►   ┌─────────┐   ────────────────────────────────────────────►  ──────────────
        │                Parts_Status                      │         │   ◄────────────────────────────────────────────  service_provider
        │    ◄────────────────────────────────────────────   │Coordinate│           parts_requirements                   ──────────────
        │                                               │  Parts  │
        │                                               │   5.0   │
        │                                               └─────────┘
        │
        │         payment_preferences                       payment_preferences
        │    ────────────────────────────────────────────►   ┌─────────┐   ────────────────────────────────────────────►  ──────────────
        │                Payment_Status                   │         │           Payment_Status                       payment
        └    ◄────────────────────────────────────────────   │ Manage  │   ◄────────────────────────────────────────────    ──────────────
                                                         │Payments │
## Level 1: Service Provider Module

```
   ┌─────────────────────┐
   │  SERVICE PROVIDER   │
   └──────────┬──────────┘
                    │
                    │  ┌─────────┐      ┌─────────┐      ┌─────────┐
                    ├─►│  Login  │──────────│Register │──────────│Services │
                    │  │   1.0   │          │   2.0   │          │   3.0   │
                    │  └─────────┘          └─────────┘          └─────────┘
                    │
                    │  ┌─────────┐      ┌─────────┐      ┌─────────┐
                    ├─►│Appoint. │──────────│  Work   │──────────│ Quality │
                    │  │   4.0   │          │ Orders  │          │   6.0   │
                    │  └─────────┘          │   5.0   │          └─────────┘
                    │                        └─────────┘
                    │
                    │
                   admin ─────────────────────────────► customer ◄───────────────────────────── seller
```

## Level 1: Delivery Supplier Module

```
   ┌─────────────────────┐
   │ DELIVERY SUPPLIER   │
   └──────────┬──────────┘
                    │
                    │  ┌─────────┐      ┌─────────┐      ┌─────────┐
                    ├─►│  Login  │──────────│Register │──────────│  Fleet  │
                    │  │   1.0   │          │   2.0   │          │   3.0   │
                    │  └─────────┘          └─────────┘          └─────────┘
                    │
                    │  ┌─────────┐      ┌─────────┐      ┌─────────┐
                    ├─►│Delivery │──────────│Tracking │──────────│ Routes  │
                    │  │   4.0   │          │   5.0   │          │   6.0   │
                    │  └─────────┘          └─────────┘          └─────────┘
                    │
                   admin ─────────────────────────────► customer ◄───────────────────────────── seller
```

## Level 1: Support Agent Module

```
   ┌─────────────────────┐
   │   SUPPORT AGENT     │
   └──────────┬──────────┘
                    │
                    │  ┌─────────┐      ┌─────────┐      ┌─────────┐
                    ├─►│  Login  │──────────│Register │──────────│ Support │
                    │  │   1.0   │          │   2.0   │          │   3.0   │
                    │  └─────────┘          └─────────┘          └─────────┘
                    │
                    │  ┌─────────┐      ┌─────────┐      ┌─────────┐
                    ├─►│  Sales  │──────────│ Issues  │──────────│ Comms   │
                    │  │   4.0   │          │   5.0   │          │   6.0   │
                    │  └─────────┘          └─────────┘          └─────────┘
                    │
                   admin ─────────────────────────────► customer ◄───────────────────────────── seller
```
```

---

## Level 1: Service Provider

### Service Provider → Processes
```
SERVICE_PROVIDER    -->     |Login Credentials|           -->     LOGIN(1.0)
SERVICE_PROVIDER    -->     |Provider Registration|      -->     REGISTER(2.0)
SERVICE_PROVIDER    -->     |Service Updates|             -->     MANAGE_SERVICES(3.0)
SERVICE_PROVIDER    -->     |Availability Schedule|       -->     MANAGE_APPOINTMENTS(4.0)
SERVICE_PROVIDER    -->     |Job Updates|                 -->     MANAGE_WORK_ORDERS(5.0)
SERVICE_PROVIDER    -->     |Quality Reports|             -->     QUALITY_MANAGEMENT(6.0)
```

### Processes → Service Provider
```
LOGIN(1.0)                  -->     |Login Acknowledgement|     -->     SERVICE_PROVIDER
REGISTER(2.0)               -->     |Registration Status|      -->     SERVICE_PROVIDER
MANAGE_SERVICES(3.0)        -->     |Service Status|           -->     SERVICE_PROVIDER
MANAGE_APPOINTMENTS(4.0)    -->     |Schedule Confirmation|    -->     SERVICE_PROVIDER
MANAGE_WORK_ORDERS(5.0)     -->     |Job Status|               -->     SERVICE_PROVIDER
QUALITY_MANAGEMENT(6.0)     -->     |Quality Status|           -->     SERVICE_PROVIDER
```

### External Entity Interactions
```
ADMIN                       -->     |Provider Approval|         -->     REGISTER(2.0)

MANAGE_APPOINTMENTS(4.0)    -->     |Appointment Details|       -->     CUSTOMER
CUSTOMER                    -->     |Booking Requests|          -->     MANAGE_APPOINTMENTS(4.0)

MANAGE_WORK_ORDERS(5.0)     -->     |Parts Requests|           -->     SELLER
SELLER                      -->     |Parts Delivery|           -->     MANAGE_WORK_ORDERS(5.0)

MANAGE_WORK_ORDERS(5.0)     -->     |Progress Updates|         -->     CUSTOMER
```

---

## Level 1: Delivery Supplier

### Delivery Supplier → Processes
```
DELIVERY_SUPPLIER   -->     |Login Credentials|           -->     LOGIN(1.0)
DELIVERY_SUPPLIER   -->     |Company Registration|       -->     REGISTER(2.0)
DELIVERY_SUPPLIER   -->     |Fleet Updates|               -->     MANAGE_FLEET(3.0)
DELIVERY_SUPPLIER   -->     |Delivery Confirmations|      -->     COORDINATE_DELIVERY(4.0)
DELIVERY_SUPPLIER   -->     |Tracking Updates|            -->     MANAGE_TRACKING(5.0)
DELIVERY_SUPPLIER   -->     |Route Preferences|           -->     OPTIMIZE_ROUTES(6.0)
```

### Processes → Delivery Supplier
```
LOGIN(1.0)                  -->     |Login Acknowledgement|     -->     DELIVERY_SUPPLIER
REGISTER(2.0)               -->     |Registration Status|      -->     DELIVERY_SUPPLIER
MANAGE_FLEET(3.0)           -->     |Fleet Status|             -->     DELIVERY_SUPPLIER
COORDINATE_DELIVERY(4.0)    -->     |Delivery Status|          -->     DELIVERY_SUPPLIER
MANAGE_TRACKING(5.0)        -->     |Tracking Confirmation|    -->     DELIVERY_SUPPLIER
OPTIMIZE_ROUTES(6.0)        -->     |Optimized Routes|         -->     DELIVERY_SUPPLIER
```

### External Entity Interactions
```
ADMIN                       -->     |Supplier Approval|         -->     REGISTER(2.0)

COORDINATE_DELIVERY(4.0)    -->     |Pickup Requests|          -->     SELLER
SELLER                      -->     |Pickup Details|           -->     COORDINATE_DELIVERY(4.0)

COORDINATE_DELIVERY(4.0)    -->     |Delivery Schedule|        -->     CUSTOMER
MANAGE_TRACKING(5.0)        -->     |Tracking Information|     -->     CUSTOMER

COORDINATE_DELIVERY(4.0)    -->     |Parts Delivery|           -->     SERVICE_PROVIDER
```

---

## Level 1: Support Agent

### Support Agent → Processes
```
SUPPORT_AGENT       -->     |Login Credentials|           -->     LOGIN(1.0)
SUPPORT_AGENT       -->     |Agent Registration|          -->     REGISTER(2.0)
SUPPORT_AGENT       -->     |Customer Assistance|         -->     HANDLE_SUPPORT(3.0)
SUPPORT_AGENT       -->     |Sales Activities|            -->     MANAGE_SALES(4.0)
SUPPORT_AGENT       -->     |Issue Resolution|            -->     RESOLVE_ISSUES(5.0)
SUPPORT_AGENT       -->     |Communication Logs|          -->     MANAGE_COMMUNICATION(6.0)
```

### Processes → Support Agent
```
LOGIN(1.0)                  -->     |Login Acknowledgement|     -->     SUPPORT_AGENT
REGISTER(2.0)               -->     |Registration Status|      -->     SUPPORT_AGENT
HANDLE_SUPPORT(3.0)         -->     |Support Status|           -->     SUPPORT_AGENT
MANAGE_SALES(4.0)           -->     |Sales Status|             -->     SUPPORT_AGENT
RESOLVE_ISSUES(5.0)         -->     |Resolution Status|        -->     SUPPORT_AGENT
MANAGE_COMMUNICATION(6.0)   -->     |Communication Status|     -->     SUPPORT_AGENT
```

### External Entity Interactions
```
ADMIN                       -->     |Agent Approval|            -->     REGISTER(2.0)

HANDLE_SUPPORT(3.0)         -->     |Support Responses|         -->     CUSTOMER
CUSTOMER                    -->     |Support Requests|          -->     HANDLE_SUPPORT(3.0)

RESOLVE_ISSUES(5.0)         -->     |Escalated Issues|          -->     ADMIN
ADMIN                       -->     |Resolution Guidance|       -->     RESOLVE_ISSUES(5.0)

RESOLVE_ISSUES(5.0)         -->     |Coordination Requests|     -->     SELLER
SELLER                      -->     |Issue Updates|             -->     RESOLVE_ISSUES(5.0)

RESOLVE_ISSUES(5.0)         -->     |Service Issues|            -->     SERVICE_PROVIDER
SERVICE_PROVIDER            -->     |Service Updates|           -->     RESOLVE_ISSUES(5.0)
```