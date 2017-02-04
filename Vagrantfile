# -*- mode: ruby -*-
# vi: set ft=ruby :

Vagrant.configure("2") do |config|

  config.vm.box = "ubuntu/trusty64"
  config.vm.box_url = "http://files.vagrantup.com/trusty64.box"
  config.vm.host_name = "sborrazas"

  config.vm.network("forwarded_port", :guest => 80, :host => 8989)
  config.vm.synced_folder(".", "/srv/apps/sborrazas/current")

  config.vm.provision("ansible") do |ansible|
    ansible.playbook = "ansible/provision.yml"

    ansible.host_key_checking = false

    ansible.groups = { "development" => ["default"] }

    ansible.skip_tags = ["remote"]

    ansible.extra_vars = {
      :ansible_ssh_user => "vagrant"
    }
  end
end
