# Software Architecture Document 📗

<div style="text-align: center;">
    <br/>
    <img src="resources/t721-logo.svg" style="width:80%;max-width: 500px;"/>
    <br/>
</div>

| Version | Prepared By | Email |
| :---:   | :---:       | :---: |
| 1.0 | Iulian Rotaru | iulian.rotaru@ticket721.com |

## Document History

| Version | Date | Description | Author |
| :---:   | :---: | :---:      | :---:  |
| 1.0 | 02/08/2019 | Initial Documentation | Iulian Rotaru |

## Table of contents

1. [Introduction](#1_introduction)
    1. [Purpose](#1_1_purpose)
    2. [Scope](#1_2_scope)
    3. [Definitions, acronyms and abbreviations](1_3_definitions)
2. [Architectural representation](#2_architectural_representation)
    1. [Logical view 💡](#2_1_logical_view)
        1. [Layer and Tiers](#2_1_1_layer_and_tiers)
        2. [Use Case Realizations](#2_1_3_use_case_realizations)
    2. [Process view 🔀](#2_2_process_view)
    3. [Implementation view 🛠](#2_3_implementation_view)
        1. [EVM](#2_3_1_evm)
        1. [Companion App](#2_3_2_companion_app)
    4. [Data view 🗄](#2_4_data_view)
    5. [Deployment view 🚀](#2_5_deployment_view)
        1. [Test infrastructure](#2_5_1_test_infrastructure)
        
# 1. Introduction
<a name="1_introduction"></a>

The introduction of the Software Architecture Document will provide an overview of the document, will describe its purpose and its intended audience, and will describe all the technical or complicated terms that reader might find in it.

## 1.1. Purpose
<a name="1_1_purpose"></a>

The Software Architecture Document inherits from all the abstract definitions of the Software Requirements Specification and provides an in-depth definition of a set of perspectives of the system. The main goal of this document is to reduce the bus factor around the product, and ease onboarding of new developers by providing a complete and concise documentation of the product's composition. It should be updated whenever modifications are brought to the underlying implementation layer or to the overlying requirements documentation.

## 1.2. Scope
<a name="1_2_scope"></a>

This document is targeting the technical members of the Product Team.

## 1.3. Definitions, acronyms and abbreviations
<a name="1_3_definitions"></a>

| Abbreviation | Description |
| :---:        | :---:       |
| `api`        | `application public inteface` |
| `T721` | Ticket721 |
| `Wallet` | A User's identity, that technically translates to a secret key owned entirely by the User |
| `T721 User` | User owning a Wallet and using User functions of the platform |
| `T721 Organizer` | User owning a Wallet and using Organizer functions of the platform (there are technically no differences between `T721 User` and `T721 Organizer`, we separate them by their Use Cases) |
| `Dapp` | Decentralized Application (in our case, using the Ethereum Virtual Machine) |

# 2. Architectural Representation
<a name="2_architectural_representation"></a>

We are using the `5+1+2 Architecture`, a direct (and custom) modification of the `4+1 Architecture`.

<div style="text-align: center;">
    <img src="resources/t721-2_1_architectural_representation_overview.svg"/>
</div>

## 2.1. Logical view 💡
<a name="2_1_logical_view"></a>

### 2.1.1. Layers and Tiers
<a name="2_1_1_layers_and_tiers"></a>

The following diagram defines the logical architecture of the system. The system follows a 4-tier architecture pattern with an extra EVM tier to represent the Ethereum Virtual Machine interactions.

<div style="text-align: center;">
    <img src="resources/t721-2_1_1_1_logical_view.svg"/>
</div>

### 2.1.2 Use case realizations
<a name="2_1_2_use_case_realizations"></a>

The following diagrams define in details the System Operation Contracts.

#### Create a T721 Account

<div style="text-align: center;">
    <img src="resources/t721-2_1_2_1_co1.svg"/>
</div>
<div style="text-align: center;">
    <img src="resources/t721-2_1_2_2_co2.svg"/>
</div>
<div style="text-align: center;">
    <img src="resources/t721-2_1_2_3_co3.svg"/>
</div>
<div style="text-align: center;">
    <img src="resources/t721-2_1_2_4_co4.svg"/>
</div>

#### Unlock T721 Wallet

<div style="text-align: center;">
    <img src="resources/t721-2_1_2_5_co5.svg"/>
</div>

#### Sign Transaction with T721 Wallet 

<div style="text-align: center;">
    <img src="resources/t721-2_1_2_6_co6.svg"/>
</div>

#### Sign Data with T721 Wallet 

<div style="text-align: center;">
    <img src="resources/t721-2_1_2_7_co7.svg"/>
</div>

#### Buy Ticket from Event 

<div style="text-align: center;">
    <img src="resources/t721-2_1_2_8_co8.svg"/>
</div>

#### Buy Ticket Sale 

<div style="text-align: center;">
    <img src="resources/t721-2_1_2_9_co9.svg"/>
</div>

#### Open Ticket Sale 

<div style="text-align: center;">
    <img src="resources/t721-2_1_2_10_co10.svg"/>
</div>

#### Close Ticket Sale 

<div style="text-align: center;">
    <img src="resources/t721-2_1_2_11_co11.svg"/>
</div>

#### Deploy Event

<div style="text-align: center;">
    <img src="resources/t721-2_1_2_12_co12.svg"/>
</div>

#### Start Event 

<div style="text-align: center;">
    <img src="resources/t721-2_1_2_13_co13.svg"/>
</div>

#### Withdraw Event Funds

<div style="text-align: center;">
    <img src="resources/t721-2_1_2_14_co14.svg"/>
</div>

#### Generate Ticket QR Codes

<div style="text-align: center;">
    <img src="resources/t721-2_1_2_15_co15.svg"/>
</div>

<div style="text-align: center;">
    <img src="resources/t721-2_1_2_16_co16.svg"/>
</div>

## 2.2. Process view 🔀
<a name="2_2_process_view"></a>

#### Create a T721 Account

<div style="text-align: center;">
    <img src="resources/t721-2_2_1_create_t721_account_activity_diagram.svg"/>
</div>

#### Unlock T721 Wallet

<div style="text-align: center;">
    <img src="resources/t721-2_2_2_unlock_t721_wallet_activity_diagram.svg"/>
</div>

#### Sign Transaction with T721 Wallet 

<div style="text-align: center;">
    <img src="resources/t721-2_2_3_sign_transaction_with_t721_wallet_activity_diagram.svg"/>
</div>

#### Sign Data with T721 Wallet 

<div style="text-align: center;">
    <img src="resources/t721-2_2_4_sign_data_with_t721_wallet_activity_diagram.svg"/>
</div>

#### Buy Ticket from Event 

<div style="text-align: center;">
    <img src="resources/t721-2_2_5_buy_ticket_from_event_activity_diagram.svg"/>
</div>

#### Buy Ticket Sale

<div style="text-align: center;">
    <img src="resources/t721-2_2_6_buy_ticket_sale_activity_diagram.svg"/>
</div>

#### Open Ticket Sale

<div style="text-align: center;">
    <img src="resources/t721-2_2_7_open_ticket_sale_activity_diagram.svg"/>
</div>

#### Close Ticket Sale

<div style="text-align: center;">
    <img src="resources/t721-2_2_8_close_ticket_sale_activity_diagram.svg"/>
</div>

#### Deploy Event 

<div style="text-align: center;">
    <img src="resources/t721-2_2_9_deploy_event_activity_diagram.svg"/>
</div>

#### Start Event

<div style="text-align: center;">
    <img src="resources/t721-2_2_10_start_event_activity_diagram.svg"/>
</div>

#### Withdraw Event Funds

<div style="text-align: center;">
    <img src="resources/t721-2_2_11_withdraw_event_funds_activity_diagram.svg"/>
</div>

#### Generate Ticket QR Codes

<div style="text-align: center;">
    <img src="resources/t721-2_2_12_generate_ticket_qr_codes_activity_diagram.svg"/>
</div>

## 2.3. Implementation view 🛠
<a name="2_3_implementation_view"></a>

### 2.3.1 EVM
<a name="2_3_1_evm"></a>

<div style="text-align: center;">
    <img src="resources/t721-2_3_1_evm_implementation_view.svg"/>
</div>

### 2.3.2 Companion App
<a name="2_3_2_companion_app"></a>

<div style="text-align: center;">
    <img src="resources/t721-2_3_2_companion_app_implementation_view.svg"/>
</div>

## 2.4. Data view 🗄
<a name="2_4_data_view"></a>

### Component Table

<div style="text-align: center;">
    <img src="resources/t721-2_4_1_data_view_component_table.svg"/>
</div>

### Address

<div style="text-align: center;">
    <img src="resources/t721-2_4_1_data_view_address.svg"/>
</div>

### Companion

<div style="text-align: center;">
    <img src="resources/t721-2_4_1_data_view_companion.svg"/>
</div>

### Event & Queuedevent

<div style="text-align: center;">
    <img src="resources/t721-2_4_1_data_view_event_queuedevent.svg"/>
</div>

### Eventcontract, Minter, Marketer & Approver

<div style="text-align: center;">
    <img src="resources/t721-2_4_1_data_view_eventcontract_minter_marketer_approver.svg"/>
</div>

### Utils

<div style="text-align: center;">
    <img src="resources/t721-2_4_1_data_view_utils.svg"/>
</div>

### Ticket

<div style="text-align: center;">
    <img src="resources/t721-2_4_1_data_view_ticket.svg"/>
</div>

### Sale

<div style="text-align: center;">
    <img src="resources/t721-2_4_1_data_view_sale.svg"/>
</div>

### User

<div style="text-align: center;">
    <img src="resources/t721-2_4_1_data_view_user.svg"/>
</div>


## 2.5. Deployment view 🚀
<a name="2_5_deployment_view"></a>

### 2.5.1. Test Infrastructure
<a name="2_5_1_test_infrastructure"></a>

<div style="text-align: center;">
    <img src="resources/t721-2_5_1_1_test_infrastructure_deployment_view.svg"/>
</div>

