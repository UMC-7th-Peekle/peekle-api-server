# Peekle Backend 🚀

## Table of Contents 📚
1. [How To ?](#how-to-)
2. [Before We Start](#before-we-start)
3. [Conventions & Template](#conventions--template)
4. [Git Convention : Strategy](#git-convention--strategy)
5. [Git Convention : Commit](#git-convention--commit)
6. [Code Convention](#code-convention)
7. [Project Architecture](#project-architecture)

## How To ? 🛠️
- 설치 및 실행 방법을 작성해주세요.

## Before We Start ⚠️
`test.test.js`라는 파일은 `.gitignore`에 의해,
git에 추적되지 않습니다. 여러가지 테스트가 필요할 땐 위와 같은 파일명을 사용해주세요.
혹시라도 `test.js`라는 파일이 필요할 수도 있어 `test.test.js`로 명명했습니다.

## Conventions & Template 📋

- GitHub Issue Template
- Git 전략 : Git Flow, GitHub Flow
- Code 작성 컨벤션 : 변수, 함수, 파일, 폴더 명명법
- docker 및 docker-compose 파일 : 빠르고 쉬운 배포
- CI/CD (GitHub Actions) : 개인서버 용 CI/CD (SSH 이용), AWS 용 CI/CD
- 다양한 기능에 대한 preset : 로그인, 채팅, 게시판
- .gitignore : `Windows`, `macOS`, `Linux`, `node`, `dotenv` 기준 + `config.json`, `*.pem`

대중적인 구조는 있지만, 세부적인 부분은 개발자 개인의 취향입니다.  
개인적으로 프로젝트나 해커톤에서 활용하기 위해 작성하였기에,  
제 개인의 취향에 맞게 적용되어 있고, 시간이 지남에 따라 맞다고 생각하는 것이 바뀌며  
템플릿을 수정할 수 있습니다.

템플릿은 여러분의 취향에 맞게 수정하여 사용해주시고, 도움이 되셨다면 ⭐ 한번만 부탁드립니다.  
preset 코드에 버그가 있을 경우 issue 생성하시어 남겨주시면 확인 후 반영하겠습니다.

감사합니다.

Repository URL -> [Click](https://github.com/kyeoungwoon/nodejs-api-server-template)  
made and owned by [@kyeoungwoon](https://github.com/kyeoungwoon) | [Naver Blog](https://blog.naver.com/kyeoungwoon)

# Git Convention : Strategy 🗂️
1. [Git Flow](#strategy-1--git-flow)
2. [GitHub Flow #1](#strategy-2--github-flow-1)
3. [GitHub Flow #2](#strategy-3--github-flow-2)

### Strategy #1 : Git Flow 🌊

- 규모가 큰 프로젝트에 적합합니다.
- 브랜치 종류 : main, develop, feature, release, hotfix

1. main :
2. develop :
3. feature :
4. release :
5. hotfix :

### Strategy #2 : GitHub Flow #1 🌐

- 규모가 작고 잦은 기능수정과 배포가 있는 프로젝트에 적합합니다.
- 브랜치 종류 : main, develop, feature

#### 1. main

- Production 환경에 언제 배포해도 문제 없는 _stable branch_ 입니다.
- 장애 혹은 버그 발생 시 main branch를 기준으로 빠르게 수정합니다.
- Initial commit을 제외하고, main branch에 commit이 직접적으로 발생하면 안됩니다.

#### 2. develop

- 새로운 feature들을 개발할 경우 main을 기준으로 develop branch를 생성 합니다.
- feature branch들을 merge 하는 곳입니다.
- feature들을 모두 merge한 후 발생되는 bug fix를 모두 마친 후, main branch로 PR을 생성합니다.
- 다시 한번 강조하지만, main branch는 모든 작업의 시작점이며, 절대적으로 stable 해야 합니다.
- 불완전한 사항들은 develop branch 내에서 해결되어야 합니다.

#### 3. feature

- develop branch를 기준으로, 새로운 기능을 개발하는 branch 입니다.
- 새로운 기능에 대한 bug fix는 feature branch 내에서 마친 후 develop branch로 PR을 생성해야 합니다.

### Strategy #3 : GitHub Flow #2 🌟

- GitHub Flow #1과 유사하지만, `develop` branch를 사용하지 않습니다.
- `main` `feature` 두 브랜치 종류로 구성되며, 해커톤과 같이 빠르게 완성하는 프로젝트에 적합합니다.
- `main`을 base로, `feature` 브랜치를 생성해서 지속적으로 `main`에 merge 하는 전략입니다.

### Merge 및 Conflict 관련 tip 🔀

#### 크게 두 가지 방법을 사용할 수 있습니다.

#### 1. GitHub Web 이용하기 🌐

`feature/login` branch를 `develop/user` branch에 merge 한다고 가정해 봅시다.

- `feature/login` branch를 push 합니다.
- GitHub 레포지토리 페이지에서 `Compare & Create Pull Request` 버튼이 생성됩니다.
- 해당 기능을 클릭한 후, `base`와 `compare` branch를 각각 아래와 같이 보이게 설정합니다.
- base: `develop/user` <- compare: `featture/login`과 같이 설정 후 사용하시면 됩니다.

#### 2. CLI 이용하기 💻

1번과 동일한 상황을 가정합니다.

- `git switch develop/user` 를 통해 이동하고 `git pull origin develop/user`를 통해 최신 변경사항을 적용합니다.
- `git merge feature/login`을 통해 merge를 시도합니다.
- 자동 병합에 성공하면 그대로 `Merge: branch 'feature/login'`과 같이 commit을 남기고 push 해주시면 됩니다.
- 자동 병합에 실패한 부분은 수동으로 conflict 해결해 주시고,
- 가능하면 해결한 부분에 주석으로 어떤 부분에 conflict가 발생하였고, 어떤 방식으로 해결하였는지 작성해주시면 좋습니다.

##### Git 전략들에 대해서 더 알아보고 싶다면 : [잘 정리해놓으신 분이 있습니다](https://sungjk.github.io/2023/02/20/branch-strategy.html)

# Git Convention : Commit 📝

`제목`, `본문`, `꼬리말` 세 부분으로 나뉩니다.  
각 부분은 빈 줄로 구분되어야 합니다.

## 제목

#### Tag: Title 의 형식을 사용해 주세요.

- Tag의 첫 문자는 대문자로 작성합니다.
- 콜론은 Tag에 붙여서 작성하고, 콜론 이후 1칸 뒤에 title을 작성합니다.
  - (X)
    - `feat:title` `feat: title` `feat :title` `feat : title`
    - `Feat :title` `Feat : title`
  - (O)
    - `Feat: title`

#### Tag의 종류와 그 구분은 다음과 같습니다.

- `Feat` : 새로운 기능이 추가되었을 때
- `Fix` : 버그를 수정하였을 때
- `Docs` : `README.md`나 주석 등 문서를 수정하였을 때
- `Style` : 코드 구조에 변경 없이 변수명 등을 수정하였을 때
- `Refactor` : 코드 동작 방식을 수정하였을 때, 또는 Style을 대규모로 변경하였을 때에도 활용.
- `Test` : 테스트 코드를 추가하였을 때
- `Chore` : `package.json`을 수정하였거나 `dockerfile` 등 분류하기 애매한 상황에서 사용
- `Merge` : branch를 merge하였을 때 사용합니다.

## 본문

- 본문은 한 줄 당 72자 내로 작성해 주세요. (다양한 환경에서의 가독성을 위하여)
- 본문 내용은 양에 구애받지 않고 최대한 상세히 작성해 주세요.
- 본문 내용은 어떻게 변경했는지 보단, 무엇을 변경했는지 또는 왜 변경했는지를 설명해 주세요.

## 꼬리말

#### Type: #issue_number 의 형식을 사용해 주세요.

- Footer는 필수적이지 않습니다.
- 다만, issue에 연관되어 생성된 commit이라면 넣어주시는 것을 추천합니다.
- `제목`을 쓸 때와 형식은 동일합니다.
  - eg. `Fixes: something`

#### Type의 종류와 구분은 다음과 같습니다.

- `Fixes` : 이슈 수정중 (아직 해결되지 않은 경우)
- `Resolves` : 이슈를 해결했을 때 사용
- `Ref` : 참고할 이슈가 있을 때 사용
- `Related to` : 해당 커밋에 관련된 이슈번호 (아직 해결되지 않은 경우)

# Code Convention 💻

## 함수명

- Camel Case를 사용합니다.
  - eg. `getUserByUserId`, `getEventByDateAndUserId`
- 길이가 길어지더라도 기능을 명확하게 명시해 주세요.
- 함수명은 겹쳐도 됩니다.
  - 하단에 import/export 관련 컨벤션 설명에서 더 자세히 알 수 있지만, 아래의 간단한 예시를 참고해주세요.
  - `user.service.js` 에 `createNewUser` 과 `user.repository.js`에 `createNewUser`이 동시에 존재하여도 됩니다.
  - service에서 사용 시에는 `userRepository.createNewUser`
  - controller에서 사용할 떄는 `userController.createNewUser`와 같이 사용합니다.
- routes 폴더에서 `express.Router()`로 정의하는 변수명은 해당 파일명과 일치하여야 합니다.
  - eg. `auth.router.js` 파일의 경우에는 `const authRouter = express.Router();` 와 같이!
  - `authRouter.get("/", handleXX)`, `userRouter.get("/", handleYY)`

## 변수명

- Snake Case를 사용합니다.
  - eg. `user_id`, `event_id`
- 팀원간 협의 후 Camel Case 또한 사용 가능합니다. 중요한 부분은 컨벤션의 통일입니다.
  - 다만, Database의 컬럼명들이 Snake Case로 작성되었기 때문에 Query문 작성 시 유의가 필요합니다.
- JSON 객체를 생성할 떄는, `{ user_id : user_id }` **(X)** `{ user_id }` **(O)** 와 같이 작성해주세요.
  - JSON 객체 생성 시 변수명만 입력하면, 자바스크립트는 자동으로 `{ 변수명: 변수값 }` 형태로 객체를 생성하는 점을 이용합니다. (객체 축약 표기법)
- 상수값에 해당하는 변수명은 전부 대문자 및 snake case로 작성되어야 합니다.
  - 환경변수 등이 해당합니다. eg. `AWS_SECRET_KEY`, `API_KEY` 등

## 파일명

- 전부 소문자를 사용하셔야 합니다.
- 상위 폴더명을 포함하여 기능을 명시해야 합니다.
- 여러 단어를 사용해야 하는 경우 . 으로 단어를 구분합니다
- eg. `user.repository.js`, `chat.service.js`

## 폴더명

- 폴더명은 길어질 경우 `-`를 활용하여 구분합니다. (kebab case)
- eg. `my-page`, `user-info`

## Error Handling ⚠️

- `class CustomError extends Error`와 같이, JavaScript 기본 Error 객체를 extend 하여 Custom Error를 작성하여야 합니다.
- Error는 세분화하여 각각 에러를 할당하는 것이 아닌, 대분류로 관리하여 reason으로 세부사항을 알 수 있도록 하여야 합니다.
- Error 명은 Pascal Case로 작성하여야 합니다.
  - `UserNotExistError` `UserAuthorizationError` `IdNotProvidedError` 등과 같이 세분화 된 것이 아니라,
  - `NotExistError` `InvalidInputError` 처럼 최대한 포괄적으로 관리하여야 합니다.
  - 세분화할 필요가 생긴다면, `UserIdNotExist` `UserNameNotExist` 수준으로 세분화 하는 것이 아닌, `InvalidUserDataInput` 과 같이 카테고리까지만 포함하여야 합니다.
- 수정은 자유이나, 다음과 같은 사항을 포함하여야 합니다.
  - `error code`
    - `string` 이여야 합니다.
    - `U001`과 같이 따로 정의해두셔도 되고, `ALREADY_EXIST`와 같이 한두 단어 정도로 간략하게 작성해주세요.
    - `U001`과 같이 코드값으로 관리하실 예정이면, 문서화 하여 팀원들 사이에 공유해 중복된 에러가 작성되지 않도록 유의해주세요.
  - `status code`
    - http status code 값 입니다.
    - 해당 에러가 발생했을 때 전송할 status code를 입력해주세요.
  - `reason`
    - 해당 에러가 발생한 이유입니다.
    - debug 시에 reason만 보고 알 수 있도록 간결하되, 모든 정보를 포함하도록 작성해 주세요.

##

```javascript
class AlreadyExistError extends Error {
  errorCode = "ALREADY_EXIST";
  statusCode = 409;

  constructor(reason, data) {
    super(reason);
    this.reason = reason;
    this.data = data;
  }
}
```

## Database 🗄️

#### _MySQL을 기준으로 설명합니다._

- 테이블명과 컬럼명 등 모든 변수명은 반드시 snake case를 사용하여야 합니다.
- PK값은 `{table명}_id` 와 같은 형식이여야 합니다.
  - eg. `user_oauth` 테이블의 PK 컬럼 명은 `user_oauth_id`
  - `bigint` 자료형을 사용하고, auto increment을 사용하여야 합니다.
  - 반정규화 (비정규화, denormailzation)로 인해 테이블이 분할된 경우에도, id값을 따로 작성하는 것을 추천합니다.
- 모든 테이블에는 `created_at`과 `updated_at`이 있어야 합니다.
  - DataType은 TIMESTAMP(6) 입니다.
  - `created_at`과 `updated_at`은 `default expression`에 `current_timestamp(6)`을 적용해두어야 합니다.
  - `updated_at`은 `on_update`에 `current_timestamp(6)`이 적용되어 있어야 합니다.
- 정규화 규칙을 되도록이면 따르는 것을 추천합니다.
- 같은 내용의 Query를 여러번 날리는 것 보다는, `JOIN`이나 `BETWEEN` 등으로 한번에 가져와서 `Node.js`단에서 처리하는 것을 권합니다.
- `image`등 파일은 `url`만을 저장해야 합니다. `binary data`를 직접적으로 저장하는 행위는 지양해야 할 1순위 입니다.

## import / export 📦

`ES6`와 `commonJS` 모두 동일하게 적용됩니다.

- `default export`의 사용을 **지양**하고,
- `named export`의 사용을 **지향**합니다.

```javascript
// 지양 : 함수를 직접 import 하여 사용하는 것
import { createNewUser } from "./user.service";

const result = createNewUser();
// user.repository에도 createNewUser 존재할 가능성이 있기에, 충돌할 우려가 있습니다.

// 지향 : 네임스페이스를 사용하여 코드를 구조화 합니다.
// eg. Java, C++

import userService from "./sample.service.js";

const result = userService.createNewUser();
```

컨벤션을 모두 지킨, router - controller - service - repository 간의 호출구조 예시입니다.

```javascript
// user.router.js
import userController from "./user.controller";

const userRouter = express.Router();
userRouter.get("/", userController.createNewUser);

// user.controller.js
import userService from "./user.service";

export const createNewUser = async (req, res, next) => {
  const { id, password } = req.body;
  // 이렇게도 되고
  await userService.createNewUser({ id, password }); // RORO
  // 이렇게 해도 됩니다.
  const data = { id, password };
  userService.createNewUser(data);

  return res.status(200).success();
};

// user.service.js
import userRepository from "./user.repository";

export const createNewUser = async (data) => {
  const result = await userRepository.createNewUser(data);

  return { message: "OK", result };
};

// user.repository.js
export const createNewUser = async (data) => {
  const result = await User.create(data);

  return result;
};
```

# Project Architecture 🏗️

## controllers

- 각 엔드포인트의 응답을 핸들링합니다.
- service에 의존적입니다.

## service

- `controllers`에서 활용할 기능 등을 위한 폴더입니다.
- 입력값 validation이나 error handling 등을 담당합니다.

## repositories

- Database 입출력을 담당합니다.
- 한 함수는 한 Query만을 담당해야 합니다.
- `try-catch`는 되도록 적용하지 않습니다.
  - request/response 형식 통일 부분을 참고하여, error 발생 시 next(err) 등으로 middleware가 에러를 캐치하는 로직으로 구현하여야 하며, DB 접속 오류가 아닌 이상 `repositories`단에서 에러가 나지 않도록 충분한 입력값 검증 후에 호풀하여야 합니다.
- `sequelize`와 같은 ORM을 사용할 때에는 repositories에서 리턴값을 가공하지 않고, `attributes`설정 등으로 query단에서 가공하여야 합니다.
  - eg.
  ```javascript
  const getUserIdByLoginId async (login_id) => {
    return await User.findOne({
      where : {
        login_id : login_id
        },
      attributes: ["user_id"]
      })
    }
  ```

## models

- ORM 사용 시 model 정의를 위한 폴더입니다.
- sequelize 기준으로, sequelize.define이 아닌 class User Extends Model 과 같은 class 형식으로 작성하여야 합니다.

```javascript
class User extends Model {
  static init(sequelize) {
    5;
    super.init(
      {
        user_id: {
          type: DataTypes.INTEGER,
          autoIncrement: true,
          primaryKey: true,
        },

        // 기타 컬럼들 ...

        created_at: {
          type: DataTypes.DATE(6),
          defaultValue: DataTypes.NOW,
          allowNull: false,
        },
        updated_at: {
          type: DataTypes.DATE(6),
          defaultValue: DataTypes.NOW,
          allowNull: false,
        },
      },
      {
        sequelize,
        tableName: "user",
        timestamps: false,
      }
    );
  }

  static associate(models) {
    // 관계형 정의 필요
    User.hasMany(models.Question, { foreignKey: "questioned_user_id" });
  }
}
```

## presets

- 자주 쓰이는 기능들에 대한 코드 preset 입니다.
- 자유롭게 변형해서 쓰시면 됩니다.
