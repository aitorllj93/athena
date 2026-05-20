

/** TODO: move this to mdbase */
export const priorityWeight = `if(priority=="minimum",0,if(priority=="low",1,if(priority=="none",2,if(priority=="medium",3,if(priority=="high",4,if(priority=="maximum",5,999))))))`