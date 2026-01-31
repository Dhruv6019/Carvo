# CarMod Database ER Diagram

```mermaid
erDiagram
    users ||--o{ admin_users : has
    users ||--o{ seller_profiles : has
    users ||--o{ service_provider_profiles : has
    users ||--o{ delivery_supplier_profiles : has
    users ||--o{ support_agent_profiles : has
    users ||--o{ customer_profiles : has
    users ||--o{ customizations : creates
    users ||--o{ quotations : requests
    users ||--o{ bookings : makes
    users ||--o{ payments : makes
    users ||--o{ orders : places
    users ||--o{ admin_logs : "creates logs"

    categories ||--o{ parts : contains
    categories ||--o{ services : categorizes

    cars ||--o{ parts : "can use"
    cars ||--o{ customizations : "can be customized"
    cars ||--o{ car_images : "has images"
    cars ||--o{ quotations : "can be quoted for"
    cars ||--o{ bookings : "can be booked for"
    cars ||--o{ orders : "can be ordered for"

    parts ||--o{ services : "can be part of"
    parts ||--o{ car_images : "can have images"
    parts ||--o{ orders : "can be ordered"

    customizations ||--o{ car_images : "has images"
    customizations ||--o{ quotations : "can be quoted for"
    customizations ||--o{ bookings : "can be booked for"
    customizations ||--o{ orders : "can be ordered"

    services ||--o{ bookings : "can be booked"
    services ||--o{ orders : "can be ordered"

    quotations ||--o{ bookings : "can lead to"
    quotations ||--o{ payments : "can be paid for"
    quotations ||--o{ orders : "can lead to"

    bookings ||--o{ payments : "can be paid for"
    bookings ||--o{ orders : "can lead to"

    payments ||--o{ orders : "can be for"
    
    support_agent_profiles }o--o{ support_agent_profiles : supervises

    classDef table fill:#f9f,stroke:#333;
    class users,cars,categories,parts,services,customizations,car_images,quotations,bookings,payments,orders,admin_logs,admin_users,seller_profiles,service_provider_profiles,delivery_supplier_profiles,support_agent_profiles,customer_profiles table;
```