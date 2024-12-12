type Json = string | number | boolean | null | { [key: string]: Json | undefined } | Json[]

interface Database {
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

interface Solution {
	solution: Array<GameEntity>
	hints: Array<Hint>
}