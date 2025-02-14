# web-uploader

Github: https://github.com/edgardimas/web-uploader

## Order Post Endpoint

### Endpoint

**POST** `http://localhost:3000/orders/`

### Expected Request Body

```json
{
    "message_dt": "20241031131827",
    "order_control": "NW",
    "site": "",
    "pid": "TESTPID3321",
    "apid": "3172124905730000",
    "name": "edgar",
    "address1": "APT. SUNTER ICON TOWER FAST 801 - DKI JAKARTA",
    "address2": "APT. SUNTER ICON TOWER FAST 801 JAKARTA UTARA -...",
    "address3": "PRUDENTIAL",
    "address4": "PRUDENTIAL LIFE ASSURANCE, PT (INDIVIDU)",
    "ptype": "OP",
    "birth_dt": "19610117110914",
    "sex": "1",
    "mobile_phone": null,
    "email": null,
    "ono": "non1884",
    "lno":"",
    "request_dt": "20241031131827",
    "source_cd": "SYSMEX",
    "source_nm": "SYSMEX' INDONESIA",
    "room_no": "RAJAL",
    "clinician_cd": "123",
    "clinician_nm": "dr. Adeline Intan Pratiwi Pasaribu, Sp.PD",
    "priority": "R",
    "diagnose": "DMT2, HT",
    "pstatus": "",
    "visitno": "1",
    "order_testid": "LAB002~020",
    "comment": null
}

```

### Success Response

**Status Code:** `201 Created`

**Response Body:**

```
Order Created Successfully

```

### Error Responses

| Status Code | Description |
| --- | --- |
| 400 | Bad Request – Invalid input |
| 500 | Internal Server Error |

### Notes

- All date-time fields (e.g., `message_dt`, `birth_dt`, `request_dt`) should follow the `YYYYMMDDHHMMSS` format.
- `order_testid` field can accept multiple test IDs separated by `~`.
- Optional fields can be `null` or an empty string as applicable.

---

## Order Patch Endpoint

### Endpoint

**PATCH** `http://localhost:3000/orders/:id`

### Expected Request Body

```json
{
   "column_name": "value"
}

```

- `column_name` should be one of the allowed fields:
    
    ```
    order_control, site, pid, apid, name, address1, address2, address3, address4, ptype, birth_dt, sex, mobile_phone, email, lno, request_dt, source_cd, source_nm, room_no, clinician_cd, clinician_nm, priority, diagnose, pstatus, visitno, order_testid, comment
    
    ```
    

### Success Response

**Status Code:** `200 OK`

**Response Body:**

```
Order updated successfully

```

### Error Responses

| Status Code | Description |
| --- | --- |
| 400 | Bad Request – Invalid input |
| 404 | Not Found – Order ID not found |
| 500 | Internal Server Error |

### Notes

- Partial updates are supported. Only the fields included in the request body will be updated.
- Ensure the column name provided is in the `allowedColumns` list.

---

## Order Delete Endpoint

### Endpoint

**DELETE** `http://localhost:3000/orders/:id`

### Success Response

**Status Code:** `200 OK`

**Response Body:**

```
Order removed successfully.

```

### Error Responses

| Status Code | Description |
| --- | --- |
| 404 | Not Found – Order ID not found |
| 500 | Internal Server Error |

### Notes

- Ensure the `id` provided in the URL path is a valid order ID.

---

## Get Results Endpoint

### Endpoint

**GET** `http://localhost:3000/results/:ono`

### Success Response

**Status Code:** `200 OK`

**Response Body:**

```json
[
  {
    "ono": "non1884",
    "lno": "25000054",
    "trx_dt": null,
    "site": null,
    "pid": "TESTPID3321",
    "apid": "3172124905730000",
    "name": null,
    "address1": null,
    "address2": null,
    "address3": null,
    "address4": null,
    "ptype": "OP",
    "birth_dt": "196101170000",
    "sex": "1",
    "mobile_phone": null,
    "email": null,
    "source_cd": null,
    "source_nm": null,
    "room_no": null,
    "clinician_cd": null,
    "clinician_nm": null,
    "priority": "R",
    "diagnose": null,
    "pstatus": "0",
    "visitno": "1",
    "comment": null,
    "updated_at": "2025-02-13T20:18:46.525Z",
    "created_at": "2025-02-13T20:14:30.098Z",
    "result_details_data": [
      {
        "id": 445,
        "ono": "non1884",
        "flag": "N",
        "unit": "U/L",
        "method": "IFCC",
        "status": "F",
        "test_cd": "019",
        "test_nm": "SGOT (AST)",
        "data_type": "NM",
        "ref_range": "< 33",
        "created_at": "2025-02-14T03:14:30.104668",
        "department": "GL^GENERAL LABORATORY",
        "updated_at": "2025-02-14T03:18:46.527097",
        "result_value": "14",
        "test_comment": "",
        "authorized_by": "SA^SYSTEM ADMINISTRATOR",
        "authorized_date": "20250214031835"
      }
    ]
  }
]

```

### Error Responses

| Status Code | Description |
| --- | --- |
| 404 | Not Found – Results not found |
| 500 | Internal Server Error |

### Notes

- Ensure the `ono` provided in the URL path is valid.

---

## Dashboard Documentation:

1. Main Page
link: http://localhost:3000/view
purpose: to see if the uploader is running or not.

![image](https://github.com/user-attachments/assets/898555d8-c377-4b15-aea8-e1e53bf4c3cf)


2. Logs
link: 
a.  http://localhost:3000/view/orderlogs
b.  http://localhost:3000/view/resultlogs
c. http://localhost:3000/view/errorlogs
purpose: to see logs of orders and results. 

![image](https://github.com/user-attachments/assets/0e758fbc-e501-448c-9cff-ff8635ae14df)


3. ONO Tracer
link: http://localhost:3000/view/onotracer
purpose: to see the whether the order is ok or not.

![image](https://github.com/user-attachments/assets/41153cbb-83d3-4ebe-9601-3adff1dcd31a)

4. Login Page
link: http://localhost:3000/view/login
purpose: to login.

![image](https://github.com/user-attachments/assets/6e280c6c-00a5-41aa-ae52-edd0256f23a7)


5. Test Mappings:
link: http://localhost:3000/view/testmappings
purpose: to see, add, and edit test mappings.

![image](https://github.com/user-attachments/assets/c975f40a-0b33-438d-9f64-eba46360c0bf)


6. Error Handler
link: http://localhost:3000/view/hclaberror/:ono
purpose: fast error handling. (access by clicking X button at Ono Tracer.
![image](https://github.com/user-attachments/assets/bd41c982-a7c6-4ead-b172-02680a4e419a)


