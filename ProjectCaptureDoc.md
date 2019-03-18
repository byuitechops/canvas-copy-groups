# Project Capture Document for Canvas-Copy-Groups
#### *Author: Seth Bolander*
#### *Stakeholder(s): Chad McLane*
#### *Date: March 18, 2019*


## Background
Canvas course copy (internal or external) does not copy a parent course's **Group**s into the child course.

-----

## Definition of Done
This tool will copy groups from a parent (source), create them in a child (target), and log a report stating successes/failures.

-----

# Requirements

### General Requirements

### Input Requirements

#### Source of Inputs
Inputs will be given based on need, will be given to a wrapper for this project, or be given via CSV. They will be input via CLI at runtime.

#### Definition of Inputs
- **Source Course ID**: <_Canvas Course ID Number_>
- **Target Course ID**: <_Canvas Course ID Number_>
- **Delete default "Project Groups" category?**: <_y(es) or n(o)_>

---

### Output Requirements
#### Destination
Output directly implemented into Canvas Target Course's Groups Section. Reports will be printed to folders **./htmlReport** and **./jsonReport**.

#### Definition of Outputs

- **./htmlReport/Group Copy.html**: HTML report
- **./jsonReport/Group Copy.json**: JSON report
- Adds/removes groups within *target* course's group sets.

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
