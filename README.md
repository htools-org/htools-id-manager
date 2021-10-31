# hTools Identity Manager

[![License](https://img.shields.io/npm/l/htools-identity-manager)](https://github.com/htools-org/htools-identity-manager/blob/master/LICENSE) [![GitHub issues](https://img.shields.io/github/issues/htools-org/htools-identity-manager)](https://github.com/htools-org/htools-identity-manager/issues)

An Identity Manager that uses [`handshake-login`](https://github.com/htools-org/handshake-login) and works with all supported strategies.

## Features

- Supports all strategies: Local Storage, WebAuthn
- Compatible with Namebase's implementation

## Usage

Simply set this DNS record.

```
Type:  TXT
Name:  _idmanager
Value: v=0;url=https://id.htools.work
```

## Contributing

Contributions are always welcome! However, please create an issue before starting any work so there won't be any repeated/wasted effort.

## Issues / Bugs

Feel free to [create a new issue](https://github.com/htools-org/htools-id-manager/issues/new) with any problems you face with the library.

## Development

Clone the project

```sh
git clone git@github.com:htools-org/htools-identity-manager.git
cd htools-identity-manager
```

Install dependencies

```sh
npm install
```

Start a hot-reloading server

```sh
npm run serve
```

Finally, build with

```sh
npm run build
```

## Acknowledgements

- [Namebase Developer docs](https://docs.namebase.io/handshake-login/oidc) for the concept
- [Namebase ID Manager](https://github.com/namebasehq/handshake-id-manager) for code reference and the first strategy
- [@Falci's gist](https://gist.github.com/Falci/8e12be1b9538c4521a3d312a02e4682d) for basic functions and simplified flow

**Proudly supported by [HandyOSS](https://github.com/HandyOSS/HandyGrants).**
