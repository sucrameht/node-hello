# We strongly recommend using the required_providers block to set the
# Azure Provider source and version being used
terraform {
  required_providers {
    azurerm = {
      source  = "hashicorp/azurerm"
      version = "=3.0.0"
    }
  }
}

# Configure the Microsoft Azure Provider
provider "azurerm" {
  features {}
}

# Create a resource group
resource "azurerm_resource_group" "nodehello-terraform-rg" {
  name     = "nodehello-terraform-resources"
  location = "Southeast Asia"
  tags = {
    environment = "dev"
  }
}

# Create a virtual network within the resource group
resource "azurerm_virtual_network" "nodehello-terraform-vn" {
  name                = "nodehello-terraform-network"
  resource_group_name = azurerm_resource_group.nodehello-terraform-rg.name
  location            = azurerm_resource_group.nodehello-terraform-rg.location
  address_space       = ["10.0.0.0/16"]
  tags = {
    environment = "dev"
  }
}

# Create a subnet within the resource group
resource "azurerm_subnet" "nodehello-terraform-subnet" {
  name                 = "nodehello-terraform-subnet"
  resource_group_name  = azurerm_resource_group.nodehello-terraform-rg.name
  virtual_network_name = azurerm_virtual_network.nodehello-terraform-vn.name
  address_prefixes     = ["10.0.0.0/24"]
}

# Create a network security group
resource "azurerm_network_security_group" "nodehello-terraform-sg" {
  name                = "nodehello-terraform-sg"
  location            = azurerm_resource_group.nodehello-terraform-rg.location
  resource_group_name = azurerm_resource_group.nodehello-terraform-rg.name
  tags = {
    environment = "dev"
  }
}

resource "azurerm_network_security_rule" "nodehello-terraform-dev-rule" {
  name                        = "nodehello-terraform-dev-rule"
  priority                    = 100
  direction                   = "Inbound"
  access                      = "Allow"
  protocol                    = "*"
  source_port_range           = "*"
  destination_port_range      = "*"
  source_address_prefix       = "*"
  destination_address_prefix  = "*"
  resource_group_name         = azurerm_resource_group.nodehello-terraform-rg.name
  network_security_group_name = azurerm_network_security_group.nodehello-terraform-sg.name
}

resource "azurerm_subnet_network_security_group_association" "nodehello-terraform-sga" {
  subnet_id                 = azurerm_subnet.nodehello-terraform-subnet.id
  network_security_group_id = azurerm_network_security_group.nodehello-terraform-sg.id
}

resource "azurerm_public_ip" "nodehello-terraform-ip" {
  name                = "nodehello-terraform-ip"
  resource_group_name = azurerm_resource_group.nodehello-terraform-rg.name
  location            = azurerm_resource_group.nodehello-terraform-rg.location
  allocation_method   = "Static"
  sku                 = "Standard"
  tags = {
    environment = "dev"
  }
}

resource "azurerm_network_interface" "nodehello-terraform-nic" {
  name                = "nodehello-terraform-nic"
  location            = azurerm_resource_group.nodehello-terraform-rg.location
  resource_group_name = azurerm_resource_group.nodehello-terraform-rg.name

  ip_configuration {
    name                          = "internal"
    subnet_id                     = azurerm_subnet.nodehello-terraform-subnet.id
    private_ip_address_allocation = "Dynamic"
    public_ip_address_id          = azurerm_public_ip.nodehello-terraform-ip.id
  }

  tags = {
    environment = "dev"
  }
}

resource "azurerm_linux_virtual_machine" "nodehello-terraform-vm" {
  name                = "nodehello-terraform-vm"
  resource_group_name = azurerm_resource_group.nodehello-terraform-rg.name
  location            = azurerm_resource_group.nodehello-terraform-rg.location
  size                = "Standard_B1s"
  admin_username      = "adminuser"
  network_interface_ids = [
    azurerm_network_interface.nodehello-terraform-nic.id,
  ]

  custom_data = filebase64("customData.tpl")

  admin_ssh_key {
    username   = "adminuser"
    public_key = file("~/.ssh/id_rsa.pub")
  }

  os_disk {
    caching              = "ReadWrite"
    storage_account_type = "Standard_LRS"
  }

  source_image_reference {
    publisher = "Canonical"
    offer     = "0001-com-ubuntu-server-jammy"
    sku       = "22_04-lts"
    version   = "latest"
  }

  tags = {
    environment = "dev"
  }
}