# athena

Command Line utilities for personal knowledge gathering

## cache

Available subcommands: clean

### clean

Clean the cache

##### Usage

```sh
athena cache clean [options] [value]
```

##### Arguments

| | |
|-|-|
|`value`|cacheKeys|

## plugin

Available subcommands: list, add, remove

### list

List installed and available plugins

##### Usage

```sh
athena plugin list [options]
```

### add

Install plugin by name

##### Usage

```sh
athena plugin add [options] <pluginName>
```

##### Arguments

| | |
|-|-|
|`pluginName`|pluginName (required)|

### remove

Uninstall plugin by name

##### Usage

```sh
athena plugin remove [options] <pluginName>
```

##### Arguments

| | |
|-|-|
|`pluginName`|pluginName (required)|

## calendar

Available subcommands: agenda, confirm-assistance, upcoming

##### Installation

```sh
athena plugin add calendar
``` 


### agenda

Display upcoming events

##### Usage

```sh
athena calendar agenda [options]
```

### confirm-assistance

Confirm assistance to an event

##### Usage

```sh
athena calendar confirm-assistance [options] <eventId>
```

##### Arguments

| | |
|-|-|
|`eventId`|eventId (required)|

### upcoming

Display upcoming events

##### Usage

```sh
athena calendar upcoming [options]
```

## mail

Available subcommands: inbox, boxes, list-unread, open, read, archive, delete, spam

##### Installation

```sh
athena plugin add mail
``` 


### inbox

List unread messages

##### Usage

```sh
athena mail inbox [options]
```

### boxes

Available subcommands: list (default)

#### list

List mail boxes

##### Usage

```sh
athena mail boxes list [options]
```

### list-unread

List unread messages

##### Usage

```sh
athena mail list-unread [options]
```

### open

Display a message

##### Usage

```sh
athena mail open [options] <messageId>
```

##### Arguments

| | |
|-|-|
|`messageId`|messageId (required)|

### read

Display a message, mark it as Seen and Archive it

##### Usage

```sh
athena mail read [options] <messageId>
```

##### Arguments

| | |
|-|-|
|`messageId`|messageId (required)|

### archive

Archive a message

##### Usage

```sh
athena mail archive [options] <messageId>
```

##### Arguments

| | |
|-|-|
|`messageId`|messageId (required)|

### delete

Move a message to Trash

##### Usage

```sh
athena mail delete [options] <messageId>
```

##### Arguments

| | |
|-|-|
|`messageId`|messageId (required)|

### spam

Move a message to Spam

##### Usage

```sh
athena mail spam [options] <messageId>
```

##### Arguments

| | |
|-|-|
|`messageId`|messageId (required)|

## map

Available subcommands: address

##### Installation

```sh
athena plugin add map
``` 


### address

Display the current coordinates address information

##### Usage

```sh
athena map address [options]
```

## morning

Available subcommands: brief

##### Installation

```sh
athena plugin add morning
``` 


### brief

Display a summary of the tasks and agenda for the day

##### Usage

```sh
athena morning brief [options]
```

## weather

Available subcommands: forecast

##### Installation

```sh
athena plugin add weather
``` 


### forecast

Display the forecast for today

##### Usage

```sh
athena weather forecast [options]
```

## tasks

Available subcommands: archive, list, complete, create, update, estimate, block, remind, schedule, set, track

##### Installation

```sh
athena plugin add tasks
``` 


### archive

Archive a task and mark it as won't do

##### Usage

```sh
athena tasks archive [options] <taskNameOrId>
```

##### Arguments

| | |
|-|-|
|`taskNameOrId`|taskNameOrId (required)|

### list

Available subcommands: project, scheduled, today, tomorrow, yesterday

#### project

Display the tasks from a project

##### Usage

```sh
athena tasks list project [options] <projectNameOrId>
```

##### Arguments

| | |
|-|-|
|`projectNameOrId`|projectNameOrId (required)|

#### scheduled

Display the scheduled tasks

##### Usage

```sh
athena tasks list scheduled [options]
```

#### today

Display the scheduled tasks for today

##### Usage

```sh
athena tasks list today [options]
```

#### tomorrow

Display the scheduled tasks for tomorrow

##### Usage

```sh
athena tasks list tomorrow [options]
```

#### yesterday

Display the scheduled tasks for yesterday

##### Usage

```sh
athena tasks list yesterday [options]
```

### complete

Complete a task

##### Usage

```sh
athena tasks complete [options] <taskNameOrId>
```

##### Arguments

| | |
|-|-|
|`taskNameOrId`|taskNameOrId (required)|

### create

Create a task

##### Usage

```sh
athena tasks create [options] <taskName>
```

##### Arguments

| | |
|-|-|
|`taskName`|taskName (required)|

### update

Update a task

##### Usage

```sh
athena tasks update [options] <taskNameOrId>
```

##### Arguments

| | |
|-|-|
|`taskNameOrId`|taskNameOrId (required)|

### estimate

Estimate a task

##### Usage

```sh
athena tasks estimate [options] <taskNameOrId> <timeEstimate>
```

##### Arguments

| | |
|-|-|
|`taskNameOrId`|taskNameOrId (required)|,|`timeEstimate`|string | number timeEstimate (required)|

### block

Set a task blocker

##### Usage

```sh
athena tasks block [options] <taskNameOrId> <blockerNameOrId>
```

##### Arguments

| | |
|-|-|
|`taskNameOrId`|taskNameOrId (required)|,|`blockerNameOrId`|blockerNameOrId (required)|

### remind

Set a task reminder

##### Usage

```sh
athena tasks remind [options] <taskNameOrId> [description]
```

##### Arguments

| | |
|-|-|
|`taskNameOrId`|taskNameOrId (required)|,|`description`|description|

### schedule

Schedule a task

##### Usage

```sh
athena tasks schedule [options] <taskNameOrId> <at>
```

##### Arguments

| | |
|-|-|
|`taskNameOrId`|taskNameOrId (required)|,|`at`|at (required)|

### set

Available subcommands: context, priority, project, due

#### context

Set Context for a task

##### Usage

```sh
athena tasks set context [options] <taskNameOrId> <contexts>
```

##### Arguments

| | |
|-|-|
|`taskNameOrId`|taskNameOrId (required)|,|`contexts`|contexts (required)|

#### priority

Set Priority for a task

##### Usage

```sh
athena tasks set priority [options] <taskNameOrId> <priority>
```

##### Arguments

| | |
|-|-|
|`taskNameOrId`|taskNameOrId (required)|,|`priority`|priority (required)|

#### project

Set Project for a task

##### Usage

```sh
athena tasks set project [options] <taskNameOrId> <projects>
```

##### Arguments

| | |
|-|-|
|`taskNameOrId`|taskNameOrId (required)|,|`projects`|projects (required)|

#### due

Set Due for a task

##### Usage

```sh
athena tasks set due [options] <taskNameOrId> <due>
```

##### Arguments

| | |
|-|-|
|`taskNameOrId`|taskNameOrId (required)|,|`due`|due (required)|

### track

Tracks a task time

##### Usage

```sh
athena tasks track [options] <taskNameOrId> [description]
```

##### Arguments

| | |
|-|-|
|`taskNameOrId`|taskNameOrId (required)|,|`description`|description|