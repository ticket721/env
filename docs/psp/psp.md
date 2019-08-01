# Product State Process (PSP)

## History

| Name | Version | Comment |
| :---: | :---: | :---: |
| Iulian Rotaru | 1.0 | Initial Version |

# Purpose

This document presents the Product State based development. This is a Product Development process made to lower communication and coordination problems between the different teams around the Product. Through complete and modern documentation, and consistent updates, the evolution is always controlled.

# Product State (PS)

The Product State represents the current state of the Product. It is composed by different types of documents that are refered to as artifacts. Each artifact has a unique purpose, and artifacts should all have the same priority: no artifact type is more important than another (ex: `code` artifacts aren't more important than `test` artifacts)

## Composition

All these difference artifacts should be linked to each other. This means that we should not document things that are not implemented, or vice-versa. These documentation artifacts are only documenting the current state of the product, not the past state, not the future state.

### Software Requirements Specification 📕

The Software Requirements Specification provides a detailed overview of the interfaces of the platform and the interactions between the actors. It does not go into deep details about the platform.

The SRS should contain:

#### Use Case View ⭐

Defines exactly what is required from the platform for it to be valid. Each Use Case is defined and has an important that can be `critical` or `non-critical`. `critical` Use Cases are going to be more detailed through all the documentation.

##### Example of Use Case Diagram

<div style="text-align:center;">
    <img src="resources/psp-use-case-diagram-example.svg" style="width: 80%;max-width: 1000px;"/>
</div>

##### Example of Non-Critical Use Case Definition

| []() | |
| :---: | :---: |
| Name | Create T721 Account |
| Code | `T721AUC1` |
| Importance | Critical |
| Primary Actor | Unauthenticated User |
| Preconditions | User provides valid credentials |
| Postconditions | New T721 account is created with given credentials, a new Wallet is generated |

##### Example of Critical Use Case Definition

| []() | |
| :---: | :---: |
| Name | Log In and use T721 Wallet |
| Code | `T721AUC2` |
| Importance | Non-Critical |
| Primary Actor | Unauthenticated User |
| Preconditions | Unauthenticated User provides valid credentials |
| Postconditions | A Token and its encrypted Wallet is sent to the Unauthenticated User |

#### UI View 🖥

In our modern product process approach, we focus a lot more on external interfaces and user interactions. This is why we included what we are calling `UI Views`. In a hierarchical manner, each section of the website has its design captured. Two reasons for this :

- It's now easier for someone non-technical or someone new to the team to have a real overview of the interfaces and how all the use cases defined in the `Use Case View` or the Critical Scenarios are triggered.

- When modification are required, it is now trivial to show previous and future version, and creates less ambiguous results.

##### Example of UI View

<div style="text-align:center;">
    <img src="resources/psp-ui-view-example.png" style="width: 80%;max-width: 1000px;"/>
</div>

#### UX View 👨‍💻

We also include an `UX View` for every `UI View`, that describes the nature of the elements present in the design, and captures key events and when they are triggered. This is very useful to keep consistent interfaces between mobile and desktop applications. Always associated with a Component Table that defines all the types of components that can be found on the `UX Views`.

##### Example of Component Table

<div style="text-align:center;">
    <img src="resources/psp-component-table-example.svg" style="width: 80%;max-width: 1000px;"/>
</div>

##### Example of UX View

<div style="text-align:center;">
    <img src="resources/psp-ux-view-example.svg" style="width: 80%;max-width: 1000px;"/>
</div>

##### Example of UI & UX View description

| []() | |
| :---: | :---: |
| Name | Event |
| Hierarchy | `UI1` > `events` > `UI5` > |
| Part of | `#desktop_web_app.UI10` |
| Unique ID | `#desktop_web_app.UI10` |
| Render Conditions | Event is selected in [Events Management Navigation (`UI5`)](#) |
| Type | UI Elements |
| --- | --- |
| `4` : on click | Copy Event URL to clipboard |
| `5` : on click | Enable Edit Mode, Navigates to [Edit Event (`UI11`)](#) |
| `20` : on click | Open [Buy Ticket from Event (`MUI1`)](#) |
| `23` : on click | Trigger [System Operation Contract 14 in Withdraw Event Funds (`CO14`)](#) |

#### Critical Scenarios ❗

Each `critical` Use Case is considered to be a Critical Scenario. This scenario is defined by two documents: the SSD (System Sequence Diagram) and the SOC (System Operation Contract). The SSD will defined all the operations between the User / Actor and the System in order for the Critical Scenario to be complete. The SSD will define several System Operations. For Each System Operation, a System Operation Contract will define all required `pre-conditions` and `post-conditions`. `pre-conditions` are conditions required by the calling Actor in order for the System Operation to work properly, the `post-conditions` are the conditions that should be met by the System in order for the Actor to consider the Operation to be complete.

##### Example of System Sequence Diagram

<div style="text-align:center;">
    <img src="resources/psp-system-sequence-diagram-example.svg" style="width: 80%;max-width: 1000px;"/>
</div>

##### Example of System Operation Contract

| []() | |
| :---: | :---: |
| Name | register(username, email, password) |
| Location | WebbApp, Server |
| Code | `CO1` |
| Preconditions | none |
| Postconditions | User instance `user` is created |
| | `user` email and username attributes are modified given `email`, `username` |
| | `user` password attribute is modified with hash of given `password` |
| | Token instance `token` is created |
| | `token` is associated to `user` |
| | `token` is returned |

#### Domain Model 🧩

Defines all the Actors en entities of our services. This is the reprensation of real-world actors, entities or concept, not software components. It pictures relations, no operations between them.

##### Example of Domain Model

<div style="text-align:center;">
    <img src="resources/psp-domain-model-example.svg" style="width: 80%;max-width: 1000px;"/>
</div>


#### Software Architecture Document 📗

This document goes deep into technical details. It is directly linked to the SRS and inherits some properties and sections defined there. It is composed of 7 Views, that define all the properties of the platform, and all of them should be edited according to current implementation. Adding a new field in a database table ? Edit the Data View. Changing the deployment configuration ? Edit the Dynamic View.

#### Implementation Artifacts 📘

### Goal of the PS

### Lifecycle of the PS

## Product State Shifting Proposal (P2SP)

### Composition

#### Title

#### Description

#### Goal

#### Assignees

#### View Updates

### Goal of the P2SP

### Example of P2SP Document

### Lifecycle of the P2SP

## Product State Shifting (P2S)

### Composition

#### Title

#### ID

#### Description

#### Goal

#### Assignees

#### View Updates

#### Approvals

### Goal of the P2S

### Example of P2S Document

### Lifecycle of the P2S

## Git

### Epics

### Issues

### Commits

### Branches

### PRs
