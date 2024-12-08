export type Json = string | number | boolean | null | { [key: string]: Json | undefined } | Json[]

export interface Database {
  public: {
    Tables: {
      Solutions: {
        Row: {               // the data expected from .select()
          id: number
          solution: Json
        }
        Insert: {            // the data to be passed to .insert()
          id?: never         // generated columns must not be supplied
          solution: Json
        }
      }
    }
  }
}