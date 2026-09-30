import { expect } from '@open-wc/testing'

import { OERSchema } from '../lib/oerschema.js'

describe('OERSchema library', () => {
  it('exposes the latest schema version', () => {
    const schema = new OERSchema()
    expect(schema.latestSchema.version).to.equal('1.2.0')
  })

  it('builds types from the instructional class hierarchy', () => {
    const schema = new OERSchema()
    expect(schema.types['oer:Course']).to.equal('Course')
    expect(schema.types['oer:CourseSection']).to.equal('CourseSection')
    expect(schema.types['oer:LearningComponent']).to.equal('LearningComponent')
    expect(schema.types['oer:LearningObjective']).to.equal('LearningObjective')
    expect(schema.types['oer:Assessment']).to.equal('Assessment')
    expect(schema.types['oer:Task']).to.equal('Task')
    expect(schema.types['oer:Lesson']).to.equal('Lesson')
    expect(schema.types['oer:Module']).to.equal('Module')
  })

  it('includes structural rubric and material types as additional types', () => {
    const schema = new OERSchema()
    expect(schema.types['oer:TableOfContents']).to.equal('TableOfContents')
    expect(schema.types['oer:TableOfContentsEntry']).to.equal(
      'TableOfContentsEntry',
    )
    expect(schema.types['oer:Rubric']).to.equal('Rubric')
    expect(schema.types['oer:RubricCriterion']).to.equal('RubricCriterion')
    expect(schema.types['oer:RubricScale']).to.equal('RubricScale')
    expect(schema.types['oer:RubricLevel']).to.equal('RubricLevel')
    expect(schema.types['oer:AssociatedMaterial']).to.equal('AssociatedMaterial')
    expect(schema.types['oer:SupportingMaterial']).to.equal('SupportingMaterial')
    expect(schema.types['oer:SupplementalMaterial']).to.equal(
      'SupplementalMaterial',
    )
    expect(schema.types['oer:ReferencedMaterial']).to.equal('ReferencedMaterial')
  })

  it('includes the root Resource class in selectable types', () => {
    const schema = new OERSchema()
    expect(schema.latestSchema.classes.Resource).to.exist
    expect(schema.latestSchema.classes.Resource.label).to.equal('Resource')
    expect(schema.types['oer:Resource']).to.equal('Resource')
  })

  it('excludes types outside the instructional hierarchy', () => {
    const schema = new OERSchema()
    expect(schema.types['oer:Person']).to.be.undefined
    expect(schema.types['oer:Organization']).to.be.undefined
    expect(schema.types['oer:True']).to.be.undefined
    expect(schema.types['oer:False']).to.be.undefined
    expect(schema.types['oer:ClassStanding']).to.be.undefined
    expect(schema.types['oer:Text']).to.be.undefined
  })

  it('documents the core Course class structure', () => {
    const schema = new OERSchema()
    const course = schema.latestSchema.classes.Course
    expect(course.subClassOf).to.include('Resource')
    expect(course.subClassOf).to.include('http://schema.org/Course')
    expect(course.properties).to.include('courseIdentifier')
    expect(course.properties).to.include('coursePrerequisites')
    expect(course.properties).to.include('termOffered')
    expect(course.properties).to.include('deliveryFormat')
  })

  it('documents rubric family classes and properties', () => {
    const schema = new OERSchema()
    const rubric = schema.latestSchema.classes.Rubric
    expect(rubric.properties).to.include('hasCriterion')
    expect(rubric.properties).to.include('rubricScale')
    expect(schema.latestSchema.classes.RubricLevel.properties).to.include(
      'levelOrdinal',
    )
    const hasCriterion = schema.latestSchema.properties.hasCriterion
    expect(hasCriterion.domain).to.include('Rubric')
    expect(hasCriterion.range).to.include('RubricCriterion')
    const levelPoints = schema.latestSchema.properties.levelPoints
    expect(levelPoints.domain).to.include('RubricLevel')
    expect(levelPoints.range).to.include('Number')
  })

  it('documents table of contents and action type definitions', () => {
    const schema = new OERSchema()
    const entry = schema.latestSchema.properties.entry
    expect(entry.domain).to.include('TableOfContents')
    expect(entry.range).to.include('TableOfContentsEntry')
    const classes = schema.latestSchema.classes
    expect(classes.Writing.subClassOf).to.include('ActionType')
    expect(classes.Reflecting.subClassOf).to.include('ActionType')
    const typeOfAction = schema.latestSchema.properties.typeOfAction
    expect(typeOfAction.domain).to.include('Task')
    expect(typeOfAction.range).to.include('ActionType')
  })

  it('documents AI usage constraint metadata on tasks', () => {
    const schema = new OERSchema()
    const ai = schema.latestSchema.properties.aiUsageConstraint
    expect(ai.domain).to.include('Task')
    expect(ai.range).to.include('Text')
    expect(ai.range).to.include('URL')
    expect(schema.latestSchema.classes.Task.properties).to.include(
      'aiUsageConstraint',
    )
  })
})
