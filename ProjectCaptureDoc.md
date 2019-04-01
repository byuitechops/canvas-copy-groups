# Project Capture Document for Canvas-Copy-Groups
#### *Author: Seth Bolander*
#### *Stakeholder(s): Chad McLane*
#### *Date: March 18, 2019*


## Background
Canvas course copy (internal or external) does not copy a parent course's **Group**s into the child course.

-----

## Definition of Done
This tool will copy groups from a parent (source), create them in a child (target), and create a report stating successes/failures/etc.

-----

# Requirements

### General Requirements

### Input Requirements

#### Source of Inputs
Inputs are based on need and will be input via prompt or via CSV. They will be entered on CLI at runtime.

#### Definition of Inputs
Read more about definition of inputs [here](https://github.com/byuitechops/canvas-copy-groups/blob/master/README.md).

---

### Output Requirements
#### Destination
Output directly implemented into Canvas Target Course's Groups Section. Reports will be printed to the console if specified so at runtime.

#### Definition of Outputs

- Adds/removes groups within *target* course's group sets directly in Canvas.
- **Console Report**: 
```json
{
    data: [
        {
            courseID: '12345',
            message: 'Group Categories Created',
            Name: 'Final Project',
            ID: '44444'
        }, {
            courseID: '12345',
            message: 'Groups Created',
            Name: 'Final Project Group 1',
            ID: 100000,
            Category: 'Final Project'
        }
    ],
    errors: [
        { ASSIGNMENT: 'Unable to locate ASSIGNMENT in the Target Course.' }
    ],
    enabled: true || false
}
```

---

### User Interface

#### Type:
CLI with Enquirer Prompt.

-----

## Expectations

### Timeline

### Best Mode of Contact

### Next Meeting


### Action Items
<!-- Recap Meeting -->
#### TechOps
#### Stakeholder

-----

#### *Approved By:* 
#### *Approval Date:*
