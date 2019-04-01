# Canvas Copy Groups
## Description

This tool copies groups from one course to another. The course groups are copied *from* is referred to as the **Source Course**. The course the groups are copied *to* is referred to as the **Target Course**.

Assignments and Discussion Topics that are set as a group assignment in the **Source Course** are located by the tool. It will attempt to find the same assignments/discussions in the **Target Course** and if found, will associate them automatically with the newly copied groups, mirroring how they are associated in the **Source Course**.

## How to Install

To install execute:
```sh
# Clone repository
$ git clone https://github.com/byuitechops/canvas-copy-groups.git

# Step into created folder
$ cd ./canvas-copy-groups

# Install dependencies
$ npm i
```

---
## How to Use
### Single Course Use
While in the install directory in your commandline, run:
```sh
$ npm start
```

You will be prompted to answer four questions:

1. Source Course ID (copying from) - <_Canvas Course ID for Parent Course_>
2. Target Course ID (copying to) - <_Canvas Course ID for Child Course_>
3. Delete the default "Project Groups" category? - <_Yes or No_> (default is **yes**)
4. Log report to console? - <_Yes or No_>

### Multiple Course Use (CSV)
While in the install directory in your commandline, run:
```sh
$ npm run-script wrap
```

You will be prompted to answer three questions:

1. File path to CSV list location - <_Relative file path from current directory to CSV_> (default is **./test.csv** which only works from the **canvas-copy-groups** directory)
  Your CSV needs to include at the very least the following:
  ```csv
  source,target
  11111,11112
  22222,22223
  33333,33334
  44444,44445
  
  ```
2. Delete the default "Project Groups" category? - <_Yes or No_> (default is **yes**)
3. Log report to console? - <_Yes or No_>