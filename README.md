# Canvas Copy Groups


## Overview

This tool copies groups from one course to another. The course groups are copied *from* is referred to as the **Source Course**. The course the groups are copied *to* is referred to as the **Target Course**.

Assignments and Discussion Topics that are set as a group assignment in the **Source Course** are located by the tool. It will attempt to find the same assignments/discussions in the **Target Course** and if found, will associate them automatically with the newly copied groups, mirroring how they are associated in the **Source Course**.

## Installation

```
npm i byuitechops/canvas-copy-groups
```

## Use

While in the install directory in your commandline, run:
```
npm start
```

You will be prompted to answer three questions:

1. Source Course ID (copying from):
2. Target Course ID (copying to):
3. Delete the default "Project Groups" category? (y/n)

The first question is the **Source Course** ID, or what course the groups will be copied from.

The second question is the **Target Course** ID. This is the course the groups will be copied to.

The last question determines whether or not it will delete the **Projects Folder** default category in the **Target Course**. The Projects Folder category is created when a course is copied or imported into Canvas. Since it is pretty much useless, this has the option to remove it for you.
