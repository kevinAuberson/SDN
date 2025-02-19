import { secureNoteName } from "./config.ts";
import { keychain, z } from "./deps.ts";

const { getNoteTXT, setNote } = keychain;

const noteSchema = z.object({
  username: z.string(),
  password: z.string(),
});

type Credentials = z.infer<typeof noteSchema>;

export const get = async (): Promise<Credentials> =>
  noteSchema.parse(JSON.parse(await getNoteTXT(secureNoteName)));

export const set = (credentials: Credentials) =>
  setNote(
    {
      name: secureNoteName,
      data: credentials,
    },
    true
  );
