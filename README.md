# JUST DO IT 소개

수립한 계획들을 수행하면 성장하는 캐릭터를 통해 보다 즐거운 계획 수립과 이행을 도와줍니다.

## 사용 기술 stack

<p>
  <img src="https://img.shields.io/badge/TypeScript-3178C6?style=for-the-badge&logo=TypeScript&logoColor=ffffff">
  <img src="https://img.shields.io/badge/react-282C34?style=for-the-badge&logo=react&logoColor=61DAFB">

  <br>
  <img src="https://img.shields.io/badge/React Query-FF4154?style=for-the-badge&logo=React Query&logoColor=white">
    <img src="https://img.shields.io/badge/Recoil-2E77BC?style=for-the-badge&logo=Recoil&logoColor=white">
<br>
  <img src="https://img.shields.io/badge/Axios-39477F?style=for-the-badge&logo=Axios&logoColor=white">
 <img src="https://img.shields.io/badge/Stomp & Sock.Js-0ABF53?style=for-the-badge&logo=Stomp & Sock.Js&logoColor=white">
 <br> <br/>
   <img src="https://img.shields.io/badge/GitHub%20Actions-232F3E?style=for-the-badge&logo=GitHubActions&logoColor=2088FF"/>
  <img src="https://img.shields.io/badge/github-%23121011.svg?style=for-the-badge&logo=github&logoColor=white">
  <br/>
 <img src="https://img.shields.io/badge/Amazon AWS-232F3E?style=for-the-badge&logo=Amazon AWS&logoColor=white">
 <img src="https://img.shields.io/badge/Amazon S3-569A31?style=for-the-badge&logo=Amazon S3&logoColor=white">

### `TypeScript`

JavsScript 기반 언어로 목적에 맞지 않는 타입 사용을 최소화 하여 코드 작성 단계에서 오류를 확인할 수 있고 버그의 사전 예방에 유용하기 때문에 기반 언어로 채택했습니다.

### `React`

JUST DO IT의 개발 Tool은 React입니다. React는 메타에서 개발한 open source library로  Dirty checking과 Virtual DOM을 활용하여 update가 필요한 DOM요소를 찾아 업데이트하기 떄문에 re-rendering이 잦은 웹에서 효율적인 동작을 합니다. 또한 React-Hooks 메소드는 보다 편리한 개발 환경을 만들어줍니다.

### `Axios`

Promise 기반 client로 주로 API통신을 위하여 사용했습니다.

### `Stomp & Sock.Js`

실시간 채팅을 위하여 사용했습니다.

## <b>JUST DO IT PREVIEW</b>
<details> <summary>><b>메인</b></summary><br/>
  
  <img src = "https://user-images.githubusercontent.com/105181833/183503317-54c235dd-2380-47ce-9a97-1f9fb6331ec6.png"/>
  <img src = "https://user-images.githubusercontent.com/105181833/183505897-6c62ea54-fd2f-4cd0-9567-ed0a4dcede83.png"/>
  </details>
<br/>
<details>  <summary><b>계획 수립</b></summary><br/> 
  <img src = "https://user-images.githubusercontent.com/105181833/183503630-4f1f7507-480f-4eb0-9ac8-e7c6f6f7151c.png"/><img src = "https://user-images.githubusercontent.com/105181833/183503982-d6cc3e1f-b8ad-4dc1-8053-28e697ec9a72.png"/><img src = "https://user-images.githubusercontent.com/105181833/183504937-d19f9930-f401-4b02-9fa4-786ef4619cce.png"/><details><br/>
</details><summary><b>게시판</b></summary><br/> 
  <img src = "https://user-images.githubusercontent.com/105181833/183504193-9f435176-b70b-436e-8b87-b9d8ea52ab24.png"/><img src = "https://user-images.githubusercontent.com/105181833/183504610-794ba83c-4fc5-47d4-83cb-8f06f1f7ef31.png"/><img src = "https://user-images.githubusercontent.com/105181833/183504808-89500443-502a-4e88-a758-91ba4156f8ec.png"/><img src = "https://user-images.githubusercontent.com/105181833/183505130-1d97fa4a-40d2-4eef-b741-ae1f9d68fbdb.png"/></details><br/>
<details><summary><b>채팅</b></summary><br/>  
  <img src = "https://user-images.githubusercontent.com/105181833/183505269-eaaf3487-55a7-4a0f-88e3-38c9a3b8f1a7.png"/><img src = "https://user-images.githubusercontent.com/105181833/183505389-acc3f6a7-3391-46cf-9b4a-dbbac4e78c05.png"/><img src = "https://user-images.githubusercontent.com/105181833/183505504-f10eefb2-dede-465d-b32c-a08e732cf3b6.png"/></details><br/>
<details><summary><b>친구</b></summary><br/> 
  <img src = "https://user-images.githubusercontent.com/105181833/183505671-d0ccfc71-64c3-4c45-afb9-329922970999.png"/>  <img src = "https://user-images.githubusercontent.com/105181833/183505771-4123e8b8-7ebb-4ced-afc0-2854a5caacc4.png"/></details>

## <b>JUST DO IT PREVIEW</b>
##이슈 및 Trouble Shooting
  <details><summary>게시물 filter</summary>
  문제 : 게시판에서 게시물을 filter할 때 query data로 넘겨주는 filter값이 바뀌지 않는 문제가 발생함.
    
    const getBoard = async ({ pageParam = 0 }) => {
        const res = await callApi.get(
            `/board?size=10&page=${pageParam}&filter=${select}&sub=${search}&keyword=${searchValue.value}`,
        );

        return {
            boardListData: res.data.content,
            page: pageParam,
            isLast: res.data.totalPages,
        };
    };
    
  접근 : 기존의 queryClient.invalidateQueries()는 data만 다시 캐싱하기 때문에 api통신을 다시 하지 않는다고 생각함.
  해결방법1 : queryClient.invalidateQueries()를 지우고 refetchInterval을 useInfiniteQuery의 onSuccess 콜백 함수에 추가해 주기적으로 refetch하게 함.
    
     const { data, fetchNextPage, isSuccess, hasNextPage} =
        useInfiniteQuery(
            'boardData',

            getBoard,

            {
                getNextPageParam: (lastPage) => {
                    if (lastPage.page + 1 !== lastPage.isLast)
                        return lastPage.page + 1;
                    return undefined;
                },
                refetchInterval: 1000,
            },
        );
    
  문제점 : 불피요한 통신과 refetch가 많아저 성능 저하가 예상됨.
  해결방법2 : select state값이 바뀔 때 useEffect를 통해 refetch하게 함.
    
    useEffect(() => {
        refetch();
    }, [select]);
    
   결과적으로 원하는 filter를 선택했을 때 refetch가 한 번만 일어나게 수정됨.
  </details>
