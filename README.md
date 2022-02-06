Build entity from merge object

Arrange all sources by priority (Get the primary source for priority)
Run over the array of source and get the data (or set data if not exist or run in reverse order and assign the new value)
Fix the entity by specific roles (set as c if can, gu forbidden rand and dischargeDate)

- mergedObject EXAMPLE
- mergedObj :
```
  {
        "_id" : ObjectId("61b9fe3272aeff3cbe6c0ed9"),
        "aka" : [
            {
                "record" : {
                    "firstName" : "Lucie",
                    "lastName" : "Rutherford",
                    "personalNumber" : "2615048",
                    "clearance" : "3",
                    "rank" : "champion",
                    "dischargeDay" : "2025-05-14T04:20:52.191Z",
                    "akaUnit" : "mordor",
                    "birthDate" : "2016-09-01T19:52:53.303Z",
                    "sex" : "female",
                    "source" : "aka"
                },
                "dataSource" : "aka",
                "runUID" : "21535a21-faad-4d68-ac6e-131ff937058f",
                "updatedAt" : ISODate("2021-12-15T14:39:46.817Z")
            }
        ],
        "es_name" : [
            {
                "record" : { .... },
                "dataSource" : "es_name",
                "runUID" : "21535a21-faad-4d68-ac6e-131ff937058f",
                "updatedAt" : ISODate("2021-12-15T14:39:46.817Z")
            }
        ],
        "identifiers" : {
            "personalNumber" : "2615048"
            "identityCard" : "2615048"
        },
        "updatedAt" : ISODate("2021-12-15T14:39:46.817Z"),
        "lock" : 0
  }
```
  result ENTITY EXAMPLE
  ```
  Entity: {
            entityType: 'tamarz',
            identityCard: '7235111',
            goalUserId: 'm72351',
            personalNumber: '723519',
            firstName: 'Janelle',
            lastName: 'Mosciski',
            akaUnit: 'gondor',
            rank: 'mega',
            job: 'Corporate Division Strategist',
            clearance: 5,
            mobilePhone: '0534724983',
          };
 ```
