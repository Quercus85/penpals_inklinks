// Establish a Socket.io connection
const socket = io();
// Initialize our Feathers client application through Socket.io
// with hooks and authentication.
const client = feathers();

client.configure(feathers.socketio(socket));
// Use localStorage to store our login token
//client.configure(feathers.authentication());

// Login screen
const welcomeHTML =
 `
<main class="mainpage container">
  <div class="row">
    <div class="col-12 col-6-tablet push-3-tablet text-center heading">
      <h1 class="font-100 header custom-header">Penpals ink-links</h1>
    </div>
  </div>
  <div class="text-center row row-top-50">
    Welcome to everyone, Schmoe's discord lovers !
  </div>
  <br />
  <div class="row">
    <p>
      I am delighted to present everyone to this initiative! Thanks Schmoe for
      the endorsment.
    </p>
    <p>
      This idea happened by chance, when Youki offered to send a colored
      postcard and I was lucky enough to be the first to request it. Receiving
      the postcard in person gave me the idea: why don't partake in a similar
      initiative open to everyone on Schmoe's discord ?
    </p>
    <p>
      The rules are a mix of an art share and secret santa: those who are
      interested will enter their discord name in the form and after a set date
      they'll be paired randomly with another pal. Then, they will send physical
      art each other !
    </p>
    <p>
      It doesn't need to be overly complicated, colored, or whatever: just put
      your soul on paper for another person and let the magic sparkle. 💖
      There's no limit about what you want to send: wherever being a watercolor
      postcard or a print, send something you feel proud or you feel it will be
      appreciated.
    </p>
  </div>
  <div class="row">
    <h3 class="font-100 header text-center custom-header">Here's the rules:</h3>
    <ul>
      <li>
        this initiative is given <span style="font-weight: bold">as is:</span> after your name has been paired, you're
        not legally bound to send something or receive it. While it goes against
        the spirit behind this initiative, things happens in life and people
        could not fulfill their part... In that case, we accept the risk. No
        hard feelings.
      </li>
      <li>
        Keep it small ! To avoid to spend too much in international shipping, send a postcard, 
        or an A5 sized sheet maximum (14.85 x 21cm, 5.8 x 8.3 inches)
      </li>
      <li>
        if there is an odd number of partecipants, the ones left out can ask if
        there is someone willing to make a drawing for him too. Just know i'm
        willing, so there will be always someone you can bet 😂
      </li>
      <li>
        You can send watercolor postcards, printings, original drawings, everything you
        feels right, made in any medium. It just have to be drawed/painted by
        you. <span style="font-weight: bold">NO AI.</span> Seriously.
      </li>
      <li>
        Take your time! After you receive your receiver's address, you don't
        have a time limit to send your drawing. Maybe don't let him wait 10 yers
        though 😂
      </li>
      <li>
        if you don't feel comfortable sharing your address, you can choose to be
        a giver. In that case, you will not receive anything, if not the joy to
        gift something! If there are multiple givers, they will be paired
        between them first
      </li>
      <li>
        You can ask your sender to draw a specific subject or let him decide,
        previous agreement. Don't ask for something too difficult or time
        consuming: thanks for the understanding!
      </li>
      <li>
        it would be nice to get a scan of your drawing before sending , so if
        the package gets lost, you can at least send a picture <span>&#128517</span>
      </li>
    </ul>
  </div>
  <div class="row">
    <h5 class="text-center">
      If you agree with the rules listed above, enter your discord handle in the
      form below, and have fun !
    </h5>
  </div>
  <div class="col-12 col-6-tablet push-3-tablet col-4-desktop push-4-desktop">
    <div class="error-message" style="color: red; display: none;"></div>
    <div class="success-message" style="color: rgb(0, 188, 0); display: none;"></div>
    <form class="form">
        <fieldset for="username">
            Insert your Discord username:
            <label>
                <input
                class="block"
                type="text"
                name="username"
                id="username"
                placeholder="Discord username"
              />
            </label>
          </fieldset>
      <fieldset for="handle">
        Insert your Discord handle:
        <label>
            <input
            class="block"
            type="text"
            name="handle"
            id="handle"
            placeholder="Discord Handle"
          />
        </label>
      </fieldset>
      <fieldset>
        <label for="country">
            Your country ?
            <input
            class="block"
            type="text"
            name="country"
            id="country"
            placeholder="Country of residence"
          />
        </label>
      </fieldset>
      <fieldset>
        <label for="giver">
          I just want to be a giver !
          <input name="giver" id="giver" type="checkbox" />
        </label>
      </fieldset>
      <button
        type="submit"
        id="postdata"
        class="button button-primary block signup"
      >
        Send!
      </button>
    </form>
  </div>
</main>
`
  ;

// Helper to safely escape HTML
const escape = str => str.replace(/&/g, '&amp;')
  .replace(/</g, '&lt;').replace(/>/g, '&gt;')


// Show the page
const showPage = (error) => {
  if (document.querySelectorAll('.mainpage').length && error) {
    document.querySelector('.heading').insertAdjacentHTML('beforeend', `<p>There was an error: ${error.message}</p>`);
  } else {
    document.getElementById('app').innerHTML = welcomeHTML;
  }
};

const addEventListener = (selector, event, handler) => {
  document.addEventListener(event, async ev => {
    if (ev.target.closest(selector)) {
      handler(ev);
    }
  });
};

const dataCheck = (username, handle, country, giver) => {
  resultObject = { name: undefined, handle: undefined, country: undefined, isGiver: false }
  if (username.length > 0) {
    resultObject.name = escape(username)
  }
  if (handle.length > 0) {
    resultObject.handle = escape(handle)
  }
  if (country.length > 0) {
    resultObject.country = escape(country)
  }
  resultObject.isGiver = giver;
  return resultObject
};

const flushObject = (data) => {
  data.name = undefined;
  data.handle = undefined;
  data.country = undefined;
  data.isGiver = undefined;
}

//the event listener check the data inserted and then create the data in the service
addEventListener('.form', 'submit', async ev => {
  const username = document.querySelector('[name="username"]').value;
  const handle = document.querySelector('[name="handle"]').value;
  const country = document.querySelector('[name="country"]').value;
  const giver = document.querySelector('[name="giver"]').checked;
  const errorMessage = document.querySelector('.error-message');
  const successMessage = document.querySelector('.success-message');

  ev.preventDefault();
  //input check
  const dataToInsert = dataCheck(username, handle, country, giver);

  if (dataToInsert.name == undefined) {
    errorMessage.textContent = 'Discord username field is mandatory';
    errorMessage.style.display = 'block';
    successMessage.style.display = 'none';
    flushObject(dataToInsert)
    return;
  } else if (dataToInsert.handle == undefined) {
    errorMessage.textContent = 'Discord handle field is mandatory';
    errorMessage.style.display = 'block';
    successMessage.style.display = 'none';
    flushObject(dataToInsert)
    return;
  } else {
    errorMessage.style.display = 'none';
  }

  try {
    const findHandle = await client.service('discordhandles').find({
      query: {
        name: dataToInsert.name,
        handle: dataToInsert.handle
      }
    });

    console.log("find: " + JSON.stringify(findHandle))

    if (findHandle.total > 0) {
      errorMessage.textContent = 'This username/handle already exists !';
      errorMessage.style.display = 'block';
      successMessage.style.display = 'none';
    }
    else {

      //chiamata al servizio
      const createHandle = await client.service('discordhandles').create({
        name: dataToInsert.name,
        handle: dataToInsert.handle,
        country: dataToInsert.country,
        isGiver: dataToInsert.isGiver
      });

      console.log(createHandle);

      if (createHandle != undefined) {
        //fields reset
        document.querySelector('[name="username"]').value = '';
        document.querySelector('[name="handle"]').value = '';
        document.querySelector('[name="country"]').value = '';
        document.querySelector('[name="giver"]').checked = false;
        successMessage.textContent = 'Your entry has been successful. Thanks for your participation !';
        successMessage.style.display = 'block';
        flushObject(dataToInsert);
      }
    }

  } catch (error) {
    console.error('Errore durante l\'invio dei dati: ', error);
  }
});

showPage();
