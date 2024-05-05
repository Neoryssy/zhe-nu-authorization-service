# authorization-service

## Configuration

Environment variables

Env|Type|Default|Description
-|-|-|-
`ALGORITHM`|`string`|`HS256`|Algorithm for JWT
`JWT_EXPIRES_IN`|`int` \| `string`|`1m`|JWT lifetime. Expressed in seconds or a string describing a time span [vercel/ms](https://github.com/vercel/ms)
`JWT_SECRET`|`string`||Secret for HMAC algorithms
`MONGODB_URI`|`string`||
`SALT_LENGTH`|`int (4-64)`|`16`|Length of the password hash salt
