## refreshToken mutation

```graphql
mutation RefreshToken {
  refreshToken {
    token
    refreshToken
  }
}
```

## menuPaths query

```graphql
query MenuPaths {
  menuPaths {
    title
    pathName
    icon
  }
}
```

## header query

```graphql
query Header {
  header {
    santander {
      status
      url
    }
    services {
      name
      url
    }
    certificates {
      name
      url
    }
    promotions {
      name
      url
    }
    news {
      status
      url
    }
  }
}
```

## advertisements query
```graphql
query Advertisements($limit: Int, status: Status) {
  
}
```