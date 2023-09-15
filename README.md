# Aplikacja Primuz

## Postgres

1. To create a new enum data type you use:

```
CREATE TYPE my_enum AS ENUM ('val1', 'val2', 'val3');
```

[More info](https://www.educba.com/postgresql-enum/)

2. Database queries will fail if they trigger functions that are no longer valid.

## Supabase

1. By default, supabase auth stores auth-session in _local storage_. To make use of it on the server however cookie-based authentication is necessary.

## Typescript/ JavaScript

1. To destructure a value that is possibly null use an empty object (or spread operator):
   ```
   const D = null;
   const { a, b, c } = D || {}
   // or: const { a, b, c} = { ...D }
   // undefined, undefined, undefined.
   ```
