import { Allow, Entity, Fields, Validators } from "remult"

@Entity("tasks", {
  allowApiCrud: Allow.authenticated,
  allowApiInsert: "admin",
  allowApiDelete: "admin"
})
export class task {
  @Fields.cuid()
  id = ""

  @Fields.string({
    validate: (task) => {
      if (task.title.length < 3) throw "Too Short"
    },
    allowApiUpdate: "admin"
  })
  title = ""

  @Fields.boolean()
  completed = false

  @Fields.createdAt()
  createdAt?: Date
}