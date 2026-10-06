## Innovative Driven Hiring
# Frontend Engineer Technical Challenges

## Approaches
* **Review a PR that has a number of small flaws / code quality issues (no AI)**
  - first walk through repo, have candidate clone it (or even provide them the repo well in advance as study material)
  - during interview, review PR together. maybe even run it locally/test it
  - potential PR issues:
    - doesnt belong syntax - dissimilar from surrounding code
    - hardcoded obviously sensitive data in repos
    - redux toolkit issues wrt slice & selectors
    - classic hooks errors like render loop
    - excessive new package dependencies (add left-pad explicitly to make it obvious this is not desired)
    - wall of text LLM comments
    - terribly-written CSS
      - ignores existing theme vars
      - !important everywhere
      - floats
      - brittle selectors
      - generic selectors with non-generic changes (IE: h1 { color: hotpink; } kinda stuff)
* **Pair programming challenge for much larger project, see how far we get (AI allowed)**
  - extend the AccessID TaskView fake product
  - do a planning session for a new feature that extends an existing, complex feature, but dont implement the feature, just analyze the plan. maybe start from a slightly flawed plan? plan flaws similar to PR flaws, just not yet code
  - potential features to dev:
    - drag & drop cards
    - new nav dropdown
    - flyout menu
    - new form
    - new data vis / report
    - responsive behavior
* **maybe do 30m of one, and 30m of another**


## Test App - AccessID TaskView (fake product)
- need a generic react/redux program to build off of. maybe a basic kanban board w/ feature flags
- table view (MUI datagrid)
- card view (drag & drop, css grid)
- query view (a la ado/jira query editors)
- all frontend
- should mirror existing stack/style choices - use react, mui, scss, redux toolkit, typescript