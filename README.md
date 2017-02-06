# SBorrazas

## Dev setup

Clone the repo and start the Vagrant VM:
```
$ git clone git@github.com:sborrazas/sborrazas.git
$ cd sborrazas
$ vagrant up
```

## Production setup

### Provision the instance

With the hosts file located in the inventory directory, and the variables set up
in `group_vars/production.yml` with Ansible Vault.

To be able to connect to EC2 hosts, you need to use the keypair that was given
to you by the keypair Ansible playbook. In order to add it to your SSH session,
run the following:

```
$ ssh-add mykey.pem
$ ssh-add -l # Make sure the session is listed
```

Then run the provisioning script:

```
$ make provision
```

## Deploying

For deploying the app, make sure you have the right configuration set on
`ansible/group_vars/production.yml` (use `production.yml.example` as an
example).

Then run:

```
$ make deploy
```
