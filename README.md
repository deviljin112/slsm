# SLSM

Serverless management CLI tool.

## About

A simple CLI tool to quickly install dependencies (NodeJS Only) and deploy serverless services.
\
Why? Because jumping between folders and running `sls deploy` is too much for me, why write 2+ commands when you can just write one.
\
It also helps with branch hopping to make sure you've installed all your dependencies, or - like me - if you use `nvm` lets you reinstall any dependencies for that node version.
\
Who is it for? For me - mainly - but maybe there's someone who will find a use for it. Or even better someone decides to expand and improve it!

## Usage

If you want a menu experience - `slsm`. That's it, the rest is self-explanatory.
\
If you want **_SPEED_** - `slsm` followed by one (or more) of the following arguments:

- `-i` | `--install` => Performs the installation of dependencies
- `-d` | `--deploy` => Performs the deployment of services
- `<service_name>` => Giving a string is treated as a service to find / target

These can be combined (or not) to get `slsm` to just prompt for the missing information.

## Examples

```bash
slsm -i api
```

Will install a service called `api` and not prompt for any user input.

```bash
slsm api s3
```

Will prompt you for an action and then proceed to find the `api` and `s3` service.

```bash
slsm -id
```

Will perform both the `install` and `deploy` actions and prompt for a service.

## Fun Fact

You can give `slsm` just the root path you want. Let's say you have a root folder `project` and inside you split your application into multiple folders like, `frontend`, `middleware`, `backend`. Each of these folders has its own set of sub folders with services.
\
You can provide `slsm` with just the root folder you want and it will find all the services and which ones require what action.

## Gotchas

If you have more than one service with the same name or a root folder named the same as a service, you're in for a treat.
\
`slsm` can end up in an infinite loop depending on your structure.

## Disclaimer

This isn't the most optimised code, it's supposed to save me time and I didn't spend too much time overthinking every line. It does what its supposed to and that's good enough for me. If you want to improve it PRs are always welcome.
\
Only tested on Ubuntu 22.04 with Node 14 + 16.