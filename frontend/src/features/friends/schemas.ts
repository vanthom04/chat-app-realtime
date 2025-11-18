import { z } from "zod"

import { identifierSchema } from "../auth/schemas"

export const getFriendSchema = z.object({
  identifier: identifierSchema
})
