// === This is a collection of helper functions to help us in manipulating the REGEX :) ===
// More info --> https://developer.mozilla.org/en-US/docs/Web/JavaScript/Guide/Regular_Expressions


const letter = /^[\w'\-,.][^0-9_!¡?÷?¿/\\+=@#$%ˆ&*(){}|~<>;:[\]]{1,}$/;
//                └───┬──┘└──────────────────┬─────────────────┘ |
//                    │                      │                   letter must be at least 2 characters long
//                    │                      │            
//                    │                      │            
//                    │                      │
//                    │                      not allowed characters
//                    │
//                    allowed characters


const username = /^(?=.{8,20}$)(?![_.])(?!.*[_.]{2})[a-zA-Z0-9._]+(?<![_.])$/;
// ^(?=.{8,20}$)(?![_.])(?!.*[_.]{2})[a-zA-Z0-9._]+(?<![_.])$
//  └─────┬────┘└───┬──┘└─────┬─────┘└─────┬─────┘ └───┬───┘
//        │         │         │            │           no _ or . at the end
//        │         │         │            │
//        │         │         │            allowed characters
//        │         │         │
//        │         │         no __ or _. or ._ or .. inside
//        │         │
//        │         no _ or . at the beginning
//        │
//        username is 8-20 characters long

const email = /^[a-zA-Z0-9.!#$%&'*+/=?^_`{|}~-]+@[a-zA-Z0-9-]+(?:\.[a-zA-Z0-9-]+)*$/;
//                   └──────────────┬──────────────┘ | └────┬────┘ └────────┬────────┘
//                                  |                |      |               .com or other initials
//                                  |                |      |
//                                  |                |      allowed characters after @
//                                  |                |
//                                  |                @ in the middle
//                                  |
//                                  allowed characters before @

const password = /^(?=.*[A-Za-z])(?=.*\d)[A-Za-z\d@$!%*#?&]{8,}$/;
//                  └─────┬─────┘ └──┬──┘ └───────┬──────┘  |
//                        |          |            |         |
//                        |          |            |         |
//                        |          |            |         |
//                        |          |            |         password must be at least 8 characters long
//                        |          |            |
//                        |          |            allowed characters
//                        |          | 
//                        |          at least one number  
//                        | 
//                        at least one letter

module.exports = {
    letter,
    username,
    email,
    password
}