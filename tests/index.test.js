const axios2 = require("axios");
const BACKEND_URL = "http://localhost:3000";
const WS_URL = "http://localhost3001";

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
    });

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
        const avatarResponse = await axios.post(`${BACKEND_URL}/api/v1/avatar`, {
            imageUrl: "https://",
            name: "Timmy",
        },{
            headers: {
                "authorization": `Bearer ${token}`
            }
        })
    })

    test("User can't update their metadata with a wrong avatar id", async ()=>{
        const response = await axios.put(`${BACKEND_URL}/api/v1/user/metadata`, {
            avatarId: "123456123456",
        }, {
            headers: {
                "authorization": `Bearer ${token}`
            }
        })

        expect(response.status).toBe(400)
    })

    test("User can update their metadata with a right avatar id", async ()=>{
        const response = await axios.put(`${BACKEND_URL}/api/v1/user/metadata`, {
            avatarId
        }, {
            headers: {
                "authorization": `Bearer ${token}`
            }
        })

        expect(response.status).toBe(200)
    })

    test("User can't update their metadata if a auth header is not present", async ()=>{
        const response = await axios.put(`${BACKEND_URL}/api/v1/user/metadata`, {
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
        const avatarResponse = await axios.post(`${BACKEND_URL}/api/v1/avatar`, {
            imageUrl: "https://",
            name: "Timmy",
        },{
            headers: {
                "authorization": `Bearer ${token}`
            }
        })
    })

    test("Get back avatar Information for a user", async ()=>{
        const response = await axios.get(`${BACKEND_URL}/api/v1/user/metadata/bulk?id=[${userId}]`);

        expect(response.data.avatars[0].length).toBe(1);
        expect(response.data.avatars[0].userId).toBe(userId);
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
        element1Id = element1Response.id
        element2Id = element2Response.id

        const mapResponse = await axios.post(`${BACKEND_URL}/api/v1/admin/map`, {
            "thumbnail": "https://thumbnail.com/a.png",
            "dimensions": "100x200",
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
    })

    test("User is able to create a space", async()=>{
        const response = axios.post(`${BACKEND_URL}/api/v1/space`, {
            "name": "Test Space",
            "dimensions": "100x200",
            "mapId": mapId
        })
        expect(response.spaceId).toBeDefined();
    })

    test("User is able to create a space without mapId (empty space)", async()=>{
        const response = axios.post(`${BACKEND_URL}/api/v1/space`, {
            "name": "Test Space",
            "dimensions": "100x200",
        })
        expect(response.spaceId).toBeDefined();
    })

    test("User is not able to create a space without mapId and dimensions", async()=>{
        const response = axios.post(`${BACKEND_URL}/api/v1/space`, {
            "name": "Test Space",
        })
        expect(response.status).toBe(400);
    })

    test("User is not able to delete a space taht doesnt exist ", async ()=>{
        const response = axios.delete(`${BACKEND_URL}/api/v1/space/123456789222222`, {
            headers: {
                authorization: `Bearer ${admintoken}`
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
        const response2 = await axios.delete(`${BACKEND_URL}/api/v1/${spaceId}`, {
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

        const response2 = await axios.delete(`${BACKEND_URL}/api/v1/${spaceId}`, {
            headers: {
                authorization: `Bearer ${admintoken}`
            }
        })
        expect(response2.status).toBe(400);
    })
    
    test("Admin has no spaces initially", async ()=>{
        const response = await axios.get(`${BACKEND_URL}/api/v1/space/all`);
        expect(response.data.spaces.length).toBe(0);
    })

    test("Admin has a singke space and try to fetch it", async ()=>{
        const spaceCreateResponse = await axios.post(`${BACKEND_URL}/api/v1/space`, {
            "name": "Test",
            "dimensions": "100x200",
        }, {
            headers: {
                authorization: `Bearer ${admintoken}`
            }
        });

        const response = await axios.get(`${BACKEND_URL}/api/v1/space/all`);
        const filteredSpace = response.data.spaces.find(x => x.id == spaceCreateResponse.spaceId)
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
        element1Id = element1Response.id
        element2Id = element2Response.id

        const mapResponse = await axios.post(`${BACKEND_URL}/api/v1/admin/map`, {
            "thumbnail": "https://thumbnail.com/a.png",
            "dimensions": "100x200",
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
        const space = axios.post(`${BACKEND_URL}/api/v1/`, {
            "name": "test",
            "dimensions": "100x200",
            "mapId": mapId,
        }, {
            headers: {
                authorization: `Bearer ${usertoken}`
            }
        })

        spaceId = space.data.spaceId;
    });

    test("Incorrect spaceId returns a 400", async ()=>{
        const response = axios.get(`${BACKEND_URL}/api/v1/space/123kjkdhsshsgssg45677888`, {
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
        const response = axios.get(`${BACKEND_URL}/api/v1/space/${spaceId}`, {
            headers: {
                authorization: `Bearer ${usertoken}`
            }
        });
        await axios.delete(`${BACKEND_URL}/api/v1/space/element`, {
            spaceId: spaceId,
            elementId: response.data.elements[0].id
        }, {
            headers: {
                authorization: `Bearer ${usertoken}`
            }
        });

        const newresponse = await axios.get(`${BACKEND_URL}/api/v1/space/${spaceId}`, {
            headers: {
                authorization: `Bearer ${usertoken}`
            }
        });
        expect(newresponse.data.elements.length).toBe(2);
    })

    test("Adding an element outside dimentions fails", async ()=>{
        await axios.post(`${BACKEND_URL}/api/v1/space/element`, {
            "elementId": element1Id,
            "spaceId": spaceId,
            "x": 1000000829282,
            "y": 2728292882922
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
        expect(newresponse.status).toBe(3);
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
    });


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
            "thumbnail": "https://thumbnail.com/a.png",
            "dimensions": "100x200",
            "defaultElements": []
        }, {
            headers: {
                authorization: `Bearer ${admintoken}`
            }
        })

        const avatarResponse = await axios.post(`${BACKEND_URL}/api/v1/admin/avatar`, {
            "imageUrl": "",
            "name": "Timmy"
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
    async function SetUpHttp() {
        const username = `Ramneet- ${Math.random()}`;
        const password = "123456";

        const adminSignupResponse = await axios.post(`${BACKEND_URL}/api/v1/signup`, {
            username,
            password,
            role: "admin"
        })
        const adminSigninResponse = await axios.post(`${BACKEND_URL}/api/v1/signin`, {
            username,
            password
        })

        admintoken = adminSigninResponse.data.token;
        adminId = adminSigninResponse.data.userId;

        const userSignupResponse = await axios.post(`${BACKEND_URL}/api/v1/signup`, {
            username: username + "-user",
            password,
        })
        const userSigninResponse = await axios.post(`${BACKEND_URL}/api/v1/signin`, {
            username: username + "-user",
            password
        })

        usertoken = adminSigninResponse.data.token;
        userId = adminSigninResponse.data.userId;

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
        element1Id = element1Response.id
        element2Id = element2Response.id

        const mapResponse = await axios.post(`${BACKEND_URL}/api/v1/admin/map`, {
            "thumbnail": "https://thumbnail.com/a.png",
            "dimensions": "100x200",
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
        const space = axios.post(`${BACKEND_URL}/api/v1/`, {
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
        w2 = new WebSocket(WS_URL);

        await new Promise((r)=>{
            w1.onopen = r;
        })
        
        await new Promise((r)=>{
            w2.onopen = r;
        })

        w1.onmessage = (event) =>{
            w1Messages.push(JSON.parse(event.data));
        }

        w2.onmessage = (event) =>{
            w2Messages.push(JSON.parse(event.data));
        }
    }
    beforeAll( async ()=>{


    })
})