const axios2 = require("axios");
const { WebSocket } = require("ws");
const BACKEND_URL = "http://localhost:3000";
const WS_URL = "ws://localhost:3001";

const axios = {
    post: async(...args)=>{
        try {
            const res = await axios2.post(...args);
            return res;
        } catch (error) {
            return error.response;
        }
    },

    get: async(...args)=>{
        try {
            const res = await axios2.get(...args);
            return res;
        } catch (error) {
            return error.response;
        }
    },

    delete: async(...args)=>{
        try {
            const res = await axios2.delete(...args);
            return res;
        } catch (error) {
            return error.response;
        }
    },

    put: async(...args)=>{
        try {
            const res = await axios2.put(...args);
            return res;
        } catch (error) {
            return error.response;
        }
    },
}
describe("Authentication", ()=>{

    test("User Signup", async ()=>{
        const username = "ramneet" + Math.random();
        const password = "123456";
        const response = await axios.post(`${BACKEND_URL}/api/v1/signup`, {
            username,
            password,
            type: "admin"
        })

        expect(response.status).toBe(200);
        
        const response2 = await axios.post(`${BACKEND_URL}/api/v1/signup`, {
            username,
            password,
            type: "admin"
        })
        expect(response2.status).toBe(400);
    }, 10000);

    test("username is not present", async ()=>{
        const username = "ramneet" + Math.random();
        const password = "123456";
        const response = await axios.post(`${BACKEND_URL}/api/v1/signup`, {
            password,
            type: "admin"
        })

        expect(response.status).toBe(400)
    })

    test("User Signin", async ()=>{
        const username = "ramneet" + Math.random();
        const password = "123456";
        await axios.post(`${BACKEND_URL}/api/v1/signup`, {
            username,
            password,
            type: "admin"
        })

        const response = await axios.post(`${BACKEND_URL}/api/v1/signin`, {
            username,
            password
        });

        expect(response.status).toBe(200)
        expect(response.data.token).toBeDefined()
    })
    test("User Signin with wrong username and password", async ()=>{
        const username = "ramneet-" + Math.random();
        const password = "123456";
        const response = await axios.post(`${BACKEND_URL}/api/v1/signin`, {
            username,
            password
        });

        expect(response.status).toBe(403)
    })
})

describe("User Information endpoints", ()=>{
    let token = "";
    let avatarId="";
    beforeAll( async()=>{
        const username = "ramneet" + Math.random();
        const password = "123456";
        await axios.post(`${BACKEND_URL}/api/v1/signup`, {
            username,
            password,
            type: "admin"
        })

        const response = await axios.post(`${BACKEND_URL}/api/v1/signin`, {
            username,
            password
        });
        token = response.data.token;
        const avatarResponse = await axios.post(`${BACKEND_URL}/api/v1/admin/avatar`, {
            imageUrl: "https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcQm3RFDZM21teuCMFYx_AROjt-AzUwDBROFww&s",
            name: "Timmy",
        },{
            headers: {
                "authorization": `Bearer ${token}`
            }
        })
        avatarId = avatarResponse.data.avatarId;
        console.log("avatarresponse is " + avatarResponse.data.avatarId)
    })

    test("User can't update their metadata with a wrong avatar id", async ()=>{
        const response = await axios.post(`${BACKEND_URL}/api/v1/user/metadata`, {
            avatarId: "123456123456",
        }, {
            headers: {
                "authorization": `Bearer ${token}`
            }
        })

        expect(response.status).toBe(400)
    })

    test("User can update their metadata with a right avatar id", async ()=>{
        const response = await axios.post(`${BACKEND_URL}/api/v1/user/metadata`, {
            avatarId
        }, {
            headers: {
                "authorization": `Bearer ${token}`
            }
        })

        expect(response.status).toBe(200)
    })

    test("User can't update their metadata if a auth header is not present", async ()=>{
        const response = await axios.post(`${BACKEND_URL}/api/v1/user/metadata`, {
            avatarId
        })

        expect(response.status).toBe(403)
    })
})

describe("User avatar Information", ()=>{
    let token = "";
    let avatarId="";
    let userId="";
    beforeAll( async()=>{
        const username = "ramneet" + Math.random();
        const password = "123456";
        const signUpResponse = await axios.post(`${BACKEND_URL}/api/v1/signup`, {
            username,
            password,
            type: "admin"
        })

        userId = signUpResponse.data.userId;

        const response = await axios.post(`${BACKEND_URL}/api/v1/signin`, {
            username,
            password
        });
        token = response.data.token;
        const avatarResponse = await axios.post(`${BACKEND_URL}/api/v1/admin/avatar`, {
            imageUrl: "https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcQm3RFDZM21teuCMFYx_AROjt-AzUwDBROFww&s",
            name: "David",
        },{
            headers: {
                "authorization": `Bearer ${token}`
            }
        })
        avatarId = avatarResponse.data.avatarId;
    })

    test("Get back avatar Information for a user", async ()=>{
        const response = await axios.get(`${BACKEND_URL}/api/v1/user/metadata/bulk?ids=[${userId}]`);
        expect(response.data.avatars).toBeDefined();
        expect(response.data.avatars.length).toBe(1);
        expect(response.data.avatars[0].userId).toBe(userId);
    })

    test("Available avatars lists the recently created avatar", async () => {
        const response = await axios.get(`${BACKEND_URL}/api/v1/avatars`);
        expect(response.data.avatars.length).not.toBe(0);
        const currentAvatar = response.data.avatars.find(x => x.id == avatarId);
        expect(currentAvatar).toBeDefined()
    })
    
})

describe("Space information", ()=>{
    let mapId;
    let element1Id;
    let element2Id;
    let token;
    let admintoken;
    let usertoken;
    let adminId;
    let userId;
    beforeAll( async ()=>{
        const username = "ramneet" + Math.random();
        const password = "123456";
        const signUpResponse = await axios.post(`${BACKEND_URL}/api/v1/signup`, {
            username,
            password,
            type: "admin"
        })

        adminId = signUpResponse.data.userId;
        const response = await axios.post(`${BACKEND_URL}/api/v1/signin`, {
            username,
            password
        });
        admintoken = response.data.token;

        const UsersignUpResponse = await axios.post(`${BACKEND_URL}/api/v1/signup`, {
            username: username + "-user",
            password,
            type: "user"
        })

        userId = UsersignUpResponse.data.userId;

        const Userresponse = await axios.post(`${BACKEND_URL}/api/v1/signin`, {
            username: username + "-user",
            password
        });

        usertoken = Userresponse.data.token;

        const element1Response = await axios.post(`${BACKEND_URL}/api/v1/admin/element`, {
            "imageUrl": "https://encrypted-tbn0.gstatic.com/shopping?q=tbn:ANd9GcRCRca3wAR4zjPPTzeIY9rSwbbqB6bB2hVkoTXN4eerXOIkJTG1GpZ9ZqSGYafQPToWy_JTcmV5RHXsAsWQC3tKnMlH_CsibsSZ5oJtbakq&usqp=CAE",
            "width": 1,
            "height": 1,
          "static": true
        }, {
            headers: {
                authorization: `Bearer ${admintoken}`
            }
        });

        const element2Response = await axios.post(`${BACKEND_URL}/api/v1/admin/element`, {
            "imageUrl": "https://encrypted-tbn0.gstatic.com/shopping?q=tbn:ANd9GcRCRca3wAR4zjPPTzeIY9rSwbbqB6bB2hVkoTXN4eerXOIkJTG1GpZ9ZqSGYafQPToWy_JTcmV5RHXsAsWQC3tKnMlH_CsibsSZ5oJtbakq&usqp=CAE",
            "width": 1,
            "height": 1,
          "static": true
        }, {
            headers: {
                authorization: `Bearer ${admintoken}`
            }
        })
        element1Id = element1Response.data.id
        element2Id = element2Response.data.id

        const mapResponse = await axios.post(`${BACKEND_URL}/api/v1/admin/map`, {
            "thumbNail": "https://thumbnail.com/a.png",
            "dimensions": "100x200",
            "name": "Test space",
            "defaultElements": [{
                elementId: element1Id,
                x:20,
                y:20
            },
            {
                elementId: element1Id,
                x:18,
                y:20 
            },
            {
                elementId: element2Id,
                x:19,
                y:20
            }
        ]
        }, {
            headers: {
                authorization: `Bearer ${admintoken}`
            }
        })
        mapId = mapResponse.data.mapId;
    },30000)

    test("User is able to create a space", async ()=>{
        const response = await axios.post(`${BACKEND_URL}/api/v1/space`, {
            "name": "Test Space",
            "dimensions": "100x200",
            "mapId": mapId
        }, {
            headers: {
                authorization: `Bearer ${usertoken}`
            },
            timeout: 20000
    })
        expect(response.status).toBe(200)
        expect(response.data.spaceId).toBeDefined();
    }, 30000)

    test("User is able to create a space without mapId (empty space)", async()=>{
        const response = await axios.post(`${BACKEND_URL}/api/v1/space`, {
            "name": "Test Space",
            "dimensions": "100x200",
        },{
            headers: {
                authorization: `Bearer ${usertoken}`
            }
    })
        expect(response.data.spaceId).toBeDefined();
    }, 30000)

    test("User is not able to create a space without mapId and dimensions", async()=>{
        const response = await axios.post(`${BACKEND_URL}/api/v1/space`, {
            "name": "Test Space",
        },{
            headers: {
                authorization: `Bearer ${usertoken}`
            }
    })
        expect(response.status).toBe(400);
    })

    test("User is not able to delete a space that doesnt exist ", async ()=>{
        const response = await axios.delete(`${BACKEND_URL}/api/v1/space/123456789222222`, {
            headers: {
                authorization: `Bearer ${usertoken}`
            }
        });
        expect(response.status).toBe(400);
    })

    test("User is able to delete the existing space", async ()=>{
        const response = await axios.post(`${BACKEND_URL}/api/v1/space`, {
            "name": "Test space",
            "dimensions": '100x200',
        }, {
            headers: {
                authorization: `Bearer ${usertoken}`
            }
        })
        const spaceId = response.data.spaceId;
        const response2 = await axios.delete(`${BACKEND_URL}/api/v1/space/${spaceId}`, {
            headers: {
                authorization: `Bearer ${usertoken}`
            }
        })
        expect(response2.status).toBe(200);
    })

    test("User should not be able to delete a space created by another user", async ()=>{
        const response = await axios.post(`${BACKEND_URL}/api/v1/space`, {
            "name": "Test space",
            "dimensions": '100x200',
        }, {
            headers: {
                authorization: `Bearer ${usertoken}`
            }
        })

        const response2 = await axios.delete(`${BACKEND_URL}/api/v1/space/${response.data.spaceId}`, {
            headers: {
                authorization: `Bearer ${admintoken}`
            }
        })
        expect(response2.status).toBe(403);
    })
    
    test("Admin has no spaces initially", async ()=>{
        const response = await axios.get(`${BACKEND_URL}/api/v1/space/all`, {
            headers: {
                authorization: `Bearer ${admintoken}`
            }

        });
        expect(response.data.spaces.length).toBe(0);
    })

    test("Admin has a single space and try to fetch it", async ()=>{
        const spaceCreateResponse = await axios.post(`${BACKEND_URL}/api/v1/space`, {
            "name": "Test",
            "dimensions": "100x200",
        }, {
            headers: {
                authorization: `Bearer ${admintoken}`
            }
        });

        const response = await axios.get(`${BACKEND_URL}/api/v1/space/all`, {
            headers: {
                authorization: `Bearer ${admintoken}`
            }

        });
        const filteredSpace = response.data.spaces.find(x => x.id == spaceCreateResponse.data.spaceId)
        expect(response.data.spaces.length).toBe(1);
        expect(filteredSpace).toBeDefined();
    })

})

describe("Arena endpoints", ()=>{
    let mapId;
    let spaceId;
    let element1Id;
    let element2Id;
    let admintoken;
    let usertoken;
    let adminId;
    let userId;
    beforeAll( async ()=>{
        const username = "ramneet" + Math.random();
        const password = "123456";
        const signUpResponse = await axios.post(`${BACKEND_URL}/api/v1/signup`, {
            username,
            password,
            type: "admin"
        })

        adminId = signUpResponse.data.userId;
        const response = await axios.post(`${BACKEND_URL}/api/v1/signin`, {
            username,
            password
        });
        admintoken = response.data.token;

        const UsersignUpResponse = await axios.post(`${BACKEND_URL}/api/v1/signup`, {
            username: username + "-user",
            password,
            type: "user"
        })

        userId = UsersignUpResponse.data.userId;

        const Userresponse = await axios.post(`${BACKEND_URL}/api/v1/signin`, {
            username: username + "-user",
            password
        });
        console.log("daadadattaa",Userresponse.data);
        usertoken = Userresponse.data.token;
        console.log(usertoken);

        const element1Response = await axios.post(`${BACKEND_URL}/api/v1/admin/element`, {
            "imageUrl": "https://encrypted-tbn0.gstatic.com/shopping?q=tbn:ANd9GcRCRca3wAR4zjPPTzeIY9rSwbbqB6bB2hVkoTXN4eerXOIkJTG1GpZ9ZqSGYafQPToWy_JTcmV5RHXsAsWQC3tKnMlH_CsibsSZ5oJtbakq&usqp=CAE",
            "width": 1,
            "height": 1,
          "static": true
        }, {
            headers: {
                authorization: `Bearer ${admintoken}`
            }
        });

        const element2Response = await axios.post(`${BACKEND_URL}/api/v1/admin/element`, {
            "imageUrl": "https://encrypted-tbn0.gstatic.com/shopping?q=tbn:ANd9GcRCRca3wAR4zjPPTzeIY9rSwbbqB6bB2hVkoTXN4eerXOIkJTG1GpZ9ZqSGYafQPToWy_JTcmV5RHXsAsWQC3tKnMlH_CsibsSZ5oJtbakq&usqp=CAE",
            "width": 1,
            "height": 1,
          "static": true
        }, {
            headers: {
                authorization: `Bearer ${admintoken}`
            }
        })
        element1Id = element1Response.data.id
        element2Id = element2Response.data.id

        const mapResponse = await axios.post(`${BACKEND_URL}/api/v1/admin/map`, {
            "thumbNail": "https://thumbnail.com/a.png",
            "dimensions": "100x200",
            "name": "Test map",
            "defaultElements": [{
                elementId: element1Id,
                x:20,
                y:20
            },
            {
                elementId: element1Id,
                x:18,
                y:20 
            },
            {
                elementId: element2Id,
                x:19,
                y:20
            }
        ]
        }, {
            headers: {
                authorization: `Bearer ${admintoken}`
            }
        })

        mapId = mapResponse.data.mapId;
        console.log("mappid->>>>>>>>>", mapId);
        const space = await axios.post(`${BACKEND_URL}/api/v1/space`, {
            "name": "test",
            "dimensions": "100x200",
            "mapId": mapId,
        }, {
            headers: {
                authorization: `Bearer ${usertoken}`
            }, timeout: 20000
        })

        spaceId = space.data.spaceId;
        console.log("spaceid------>>>>>", spaceId);
    }, 30000);

    test("Incorrect spaceId returns a 400", async ()=>{
        const response = await axios.get(`${BACKEND_URL}/api/v1/space/123kjkdhsshsgssg45677888`, {
            headers: {
                authorization: `Bearer ${usertoken}`
            }
        });
        expect(response.status).toBe(400);
    })

    test("Correct spaceId returns all the elements", async ()=>{
        const response = await axios.get(`${BACKEND_URL}/api/v1/space/${spaceId}`, {
            headers: {
                authorization: `Bearer ${usertoken}`
            }
        });
        expect(response.data.dimensions).toBe("100x200");
        expect(response.data.elements.length).toBe(3);
    })
    

    test("Delete endpoint is able to delete an element", async ()=>{
        const response = await axios.get(`${BACKEND_URL}/api/v1/space/${spaceId}`, {
            headers: {
                authorization: `Bearer ${usertoken}`
            }
        });
        const elementId = response.data.elements[0].id;

        const deletedResponse = await axios.delete(`${BACKEND_URL}/api/v1/element/deleteElement/${elementId}`,{
            headers: {
                authorization: `Bearer ${usertoken}`
            }
        })

        const newresponse = await axios.get(`${BACKEND_URL}/api/v1/space/${spaceId}`, {
            headers: {
                authorization: `Bearer ${usertoken}`
            }
        });
        expect(newresponse.data.elements.length).toBe(2);
    }, 20000)

    test("Adding an element outside dimensions fails", async ()=>{
        const newresponse = await axios.post(`${BACKEND_URL}/api/v1/space/element`, {
            "elementId": element1Id,
            "spaceId": spaceId,
            "x": 100282,
            "y": 288292
        }, {
            headers: {
                authorization: `Bearer ${usertoken}`
            }
        });
        expect(newresponse.status).toBe(400);
    })

    test("Adding an element works correctly", async ()=>{
        await axios.post(`${BACKEND_URL}/api/v1/space/element`, {
            "elementId": element1Id,
            "spaceId": spaceId,
            "x": 50,
            "y": 20
        }, {
            headers: {
                authorization: `Bearer ${usertoken}`
            }
        });

        const newResponse = await axios.get(`${BACKEND_URL}/api/v1/space/${spaceId}`, {
            headers: {
                authorization: `Bearer ${usertoken}`
            }
        });
        expect(newResponse.data.elements.length).toBe(3);
    })

})

describe("Admin Endpoints", ()=>{
    let admintoken;
    let usertoken;
    let adminId;
    let userId;
    beforeAll( async ()=>{
        const username = "ramneet" + Math.random();
        const password = "123456";
        const signUpResponse = await axios.post(`${BACKEND_URL}/api/v1/signup`, {
            username,
            password,
            type: "admin"
        })

        adminId = signUpResponse.data.userId;
        const response = await axios.post(`${BACKEND_URL}/api/v1/signin`, {
            username,
            password
        });
        admintoken = response.data.token;

        const UsersignUpResponse = await axios.post(`${BACKEND_URL}/api/v1/signup`, {
            username: username + "-user",
            password,
            type: "user"
        })

        userId = UsersignUpResponse.data.userId;

        const Userresponse = await axios.post(`${BACKEND_URL}/api/v1/signin`, {
            username: username + "-user",
            password
        });

        usertoken = Userresponse.data.token;
    }, 30000);


    test("User is not able to hit admin Endpoints", async ()=>{

        const elementResponse = await axios.post(`${BACKEND_URL}/api/v1/admin/element`, {
            "imageUrl": "https://encrypted-tbn0.gstatic.com/shopping?q=tbn:ANd9GcRCRca3wAR4zjPPTzeIY9rSwbbqB6bB2hVkoTXN4eerXOIkJTG1GpZ9ZqSGYafQPToWy_JTcmV5RHXsAsWQC3tKnMlH_CsibsSZ5oJtbakq&usqp=CAE",
            "width": 1,
            "height": 1,
          "static": true
        }, {
            headers: {
                authorization: `Bearer ${usertoken}`
            }
        });

        const mapResponse = await axios.post(`${BACKEND_URL}/api/v1/admin/map`, {
            "thumbnail": "https://thumbnail.com/a.png",
            "dimensions": "100x200",
            "defaultElements": []
        }, {
            headers: {
                authorization: `Bearer ${usertoken}`
            }
        })

        const avatarResponse = await axios.post(`${BACKEND_URL}/api/v1/admin/avatar`, {
            "imageUrl": "",
            "name": "Timmy"
        }, {
            headers: {
                authorization: `Bearer ${usertoken}`
            }
        })
        
        const updateElementResponse = await axios.put(`${BACKEND_URL}/api/v1/admin/element/123`, {
            "imageUrl": "https://encrypted-tbn0.gstatic.com/shopping?q=tbn:AN",
        }, {
            headers: {
                authorization: `Bearer ${usertoken}`
            }
        })
        expect(elementResponse.status).toBe(403);
        expect(mapResponse.status).toBe(403);
        expect(avatarResponse.status).toBe(403);
        expect(updateElementResponse.status).toBe(403);
    })

    test("Admin is  able to hit admin Endpoints", async ()=>{

        const elementResponse = await axios.post(`${BACKEND_URL}/api/v1/admin/element`, {
            "imageUrl": "https://encrypted-tbn0.gstatic.com/shopping?q=tbn:ANd9GcRCRca3wAR4zjPPTzeIY9rSwbbqB6bB2hVkoTXN4eerXOIkJTG1GpZ9ZqSGYafQPToWy_JTcmV5RHXsAsWQC3tKnMlH_CsibsSZ5oJtbakq&usqp=CAE",
            "width": 1,
            "height": 1,
          "static": true
        }, {
            headers: {
                authorization: `Bearer ${admintoken}`
            }
        });

        const mapResponse = await axios.post(`${BACKEND_URL}/api/v1/admin/map`, {
            "thumbNail": "https://thumbnail.com/a.png",
            "dimensions": "100x200",
            "name": "test map",
            "defaultElements": []
        }, {
            headers: {
                authorization: `Bearer ${admintoken}`
            }
        })

        const avatarResponse = await axios.post(`${BACKEND_URL}/api/v1/admin/avatar`, {
            "imageUrl": "https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcQm3RFDZM21teuCMFYx_AROjt-AzUwDBROFww&s",
            "name": "Tim"
        }, {
            headers: {
                authorization: `Bearer ${admintoken}`
            }
        })
        expect(elementResponse.status).toBe(200);
        expect(mapResponse.status).toBe(200);
        expect(avatarResponse.status).toBe(200);
    })

    test("Admin is able to update a imageUrl for an element", async ()=>{

        const elementResponse = await axios.post(`${BACKEND_URL}/api/v1/admin/element`, {
            "imageUrl": "",
            "width": 1,
            "height": 1,
            "static": true
        }, {
            headers: {
                authorization: `Bearer ${admintoken}`
            }
        })
        const updateElementResponse = await axios.put(`${BACKEND_URL}/api/v1/admin/element/${elementResponse.data.id}`, {
            "imageUrl": "https://encrypted-tbn0.gstatic.com/shopping?q=tbn:AN",
        }, {
            headers: {
                authorization: `Bearer ${admintoken}`
            }
        })

        expect(updateElementResponse.status).toBe(200);
    })

})

describe("Websockets tests", ()=> {

    let admintoken;
    let usertoken;
    let adminId;
    let userId;
    let mapId;
    let spaceId;
    let element1Id;
    let element2Id;
    let ws1;
    let ws2;
    let w1Messages = [];
    let w2Messages = [];
    let userX;
    let userY;
    let adminX;
    let adminY;

    async function SetUpHttp() {
        const username = `Ramneet-${Math.random()}`;
        const password = "123456";

        const adminSignupResponse = await axios.post(`${BACKEND_URL}/api/v1/signup`, {
            username,
            password,
            type: "admin"
        })
        const adminSigninResponse = await axios.post(`${BACKEND_URL}/api/v1/signin`, {
            username,
            password,
        })

        adminId = adminSignupResponse.data.userId;
        admintoken = adminSigninResponse.data.token;
        console.log(admintoken);

        const userSignupResponse = await axios.post(`${BACKEND_URL}/api/v1/signup`, {
            username: username + "-user",
            password,
            type: "user"
        })
        const userSigninResponse = await axios.post(`${BACKEND_URL}/api/v1/signin`, {
            username: username + "-user",
            password
        })
        
        userId = userSignupResponse.data.userId;
        usertoken = userSigninResponse.data.token;
        console.log(userSigninResponse);
        console.log(usertoken);

        const element1Response = await axios.post(`${BACKEND_URL}/api/v1/admin/element`, {
            "imageUrl": "https://encrypted-tbn0.gstatic.com/shopping?q=tbn:ANd9GcRCRca3wAR4zjPPTzeIY9rSwbbqB6bB2hVkoTXN4eerXOIkJTG1GpZ9ZqSGYafQPToWy_JTcmV5RHXsAsWQC3tKnMlH_CsibsSZ5oJtbakq&usqp=CAE",
            "width": 1,
            "height": 1,
          "static": true
        }, {
            headers: {
                authorization: `Bearer ${admintoken}`
            }
        });

        const element2Response = await axios.post(`${BACKEND_URL}/api/v1/admin/element`, {
            "imageUrl": "https://encrypted-tbn0.gstatic.com/shopping?q=tbn:ANd9GcRCRca3wAR4zjPPTzeIY9rSwbbqB6bB2hVkoTXN4eerXOIkJTG1GpZ9ZqSGYafQPToWy_JTcmV5RHXsAsWQC3tKnMlH_CsibsSZ5oJtbakq&usqp=CAE",
            "width": 1,
            "height": 1,
          "static": true
        }, {
            headers: {
                authorization: `Bearer ${admintoken}`
            }
        })
        element1Id = element1Response.data.id
        element2Id = element2Response.data.id

        const mapResponse = await axios.post(`${BACKEND_URL}/api/v1/admin/map`, {
            "thumbNail": "https://thumbnail.com/a.png",
            "dimensions": "100x200",
            "name": "test map",
            "defaultElements": [{
                elementId: element1Id,
                x:20,
                y:20
            },
            {
                elementId: element1Id,
                x:18,
                y:20 
            },
            {
                elementId: element2Id,
                x:19,
                y:20
            }
        ]
        }, {
            headers: {
                authorization: `Bearer ${admintoken}`
            }
        })

        mapId = mapResponse.data.mapId;

        const space = await axios.post(`${BACKEND_URL}/api/v1/space`, {
            "name": "test",
            "dimensions": "100x200",
            "mapId": mapId,
        }, {
            headers: {
                authorization: `Bearer ${usertoken}`
            }
        })

        spaceId = space.data.spaceId;

    }
    async function SetUpWs() {
        w1 = new WebSocket(WS_URL);

        w1.onmessage = (event) =>{
            w1Messages.push(JSON.parse(event.data));
        }

        await new Promise((r)=>{
            w1.onopen = r;
        })

        w2 = new WebSocket(WS_URL);

        w2.onmessage = (event) =>{
            w2Messages.push(JSON.parse(event.data));
        }

        await new Promise((r)=>{
            w2.onopen = r;
        })
        console.log("done");
    }
    async function waitforPopLatestMessage(messageArray){
        return new Promise((resolve) => {
            if(messageArray.length>0){
                resolve(messageArray.shift());
            }
            else{
                let interval = setInterval(()=>{ // repeated call and if the condition written inside the if block fullfiles then we clear the interval and this eventually stops
                    if(messageArray.length>0){ 
                        resolve(messageArray.shift());
                        clearInterval(interval);
                    }
                }, 100)
            }
        })
    }
    beforeAll( async ()=>{
        await SetUpHttp();
        await SetUpWs();
    }, 80000)

    test("get back the acknowlgement for joining the space", async ()=>{

        w1.send(JSON.stringify({
            "type": "join",
            "payload": {
                "spaceId": spaceId,
                "token": admintoken,
            }
        }))

        const message1 = await waitforPopLatestMessage(w1Messages);
        console.log("message1", message1);

        w2.send(JSON.stringify({
            "type": "join",
            "payload": {
                "spaceId": spaceId,
                "token": usertoken,
            }
        }))
        const message2 = await waitforPopLatestMessage(w2Messages);

        const message3 = await waitforPopLatestMessage(w1Messages);

        adminX = message1.payload.spawn.x;
        adminY = message1.payload.spawn.y;

        userX  = message2.payload.spawn.x;
        userY  = message2.payload.spawn.y;

        expect(message1.type).toBe("space-joined")
        expect(message2.type).toBe("space-joined")
        expect(message1.payload.users.length).toBe(0)
        expect(message2.payload.users.length).toBe(1)

        //when user2 joins user1 gets to know that user2 has joined so as he joins we broadcast to every user in romm here only 2 user's we have, so user 1 array got a message user-joined and its position so here we are matching it.
        expect(message3.type).toBe("user-joined")
        expect(message3.payload.x).toBe(message2.payload.spawn.x);
        expect(message3.payload.y).toBe(message2.payload.spawn.y);
        expect(message3.payload.userId).toBe(userId);
    }, 30000)
    test("user should not be able to move across around the boundary of the wall", async ()=>{
        w1.send(JSON.stringify({
            "type": "move",
            "payload": {
                x: 10000,
                y: 10000,
            }
        }))
        const message = await waitforPopLatestMessage(w1Messages);
        expect(message.type).toBe("movement-rejected");
        // send back to previous position
        expect(message.payload.x).toBe(adminX)
        expect(message.payload.y).toBe(adminY)
    })
    test("Users should not be able to move more than 1 block at the same time", async ()=>{
        w1.send(JSON.stringify({
            type: "move",
            payload: {
                x: adminX + 2,
                y: adminY
            }
        }));
        const message = await waitforPopLatestMessage(w1Messages);
        expect(message.type).toBe("movement-rejected");
        expect(message.payload.x).toBe(adminX);
        expect(message.payload.y).toBe(adminY);
    })
    test("Correct movement of a user should be broadcasted to all other users in the room", async ()=>{
        w1.send(JSON.stringify({
            "type": "move",
            "payload": {
                x: adminX + 1,
                y: adminY,
                userId: adminId
            }
        }))
        const message = await waitforPopLatestMessage(w2Messages);
        expect(message.type).toBe("movement");
        expect(message.payload.x).toBe(adminX+1);
        expect(message.payload.y).toBe(adminY);

    })

    test("If a user leaves other gets notified or the other user receievs an leav event", async ()=>{
        w1.close();
        const message = await waitforPopLatestMessage(w2Messages);
        expect(message.type).toBe("user-left");
        expect(message.payload.userId).toBe(adminId);
    })
})