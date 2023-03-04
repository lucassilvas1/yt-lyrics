<script lang="ts">
  import { ContentMessage } from "../../types/messages";
  import { appName, searchTerm } from "../stores/misc";

  export let error: Extract<
    ContentMessage["fetchLyrics"]["response"],
    { error: string }
  >["error"];

  let showDetails = false;

  const errorMap: Record<typeof error, { message: string; details: string }> = {
    TrackNotFound: {
      message: "Could not find track.",
      details: `${$appName} could not find a track for "${$searchTerm}".<br>Try searching for different keywords`,
    },
    LyricsNotFound: {
      message: "Could not find lyrics for track.",
      details: "Sorry, we can't find lyrics for that track.",
    },
    LoggedOut: {
      message: "Please make sure you are logged into your Spotify account.",
      details: `You must be logged into Spotify in this browser in order for ${$appName} to work.<br>Please go to the <a href="https://open.spotify.com" target="_blank" rel="noreferrer">Spotify</a> website and make sure you are logged in, then refresh this page.`,
    },
    UnknownError: {
      message: "Something went wrong, please try again later...",
      details: "",
    },
  };
</script>

{#if showDetails}
  <div
    class="yt-lyrics-content-wrapper yt-lyrics-area-wrapper normal-text details"
  >
    {@html errorMap[error].details}
  </div>
{:else}
  <div class="yt-lyrics-content-wrapper yt-lyrics-area-wrapper">
    <div>
      {errorMap[error].message}
      {#if errorMap[error].details}
        <button
          class="normal-text"
          type="button"
          on:click={() => {
            showDetails = true;
          }}>See details</button
        >
      {/if}
    </div>
  </div>
{/if}

<style>
  .yt-lyrics-area-wrapper {
    display: flex;
    flex-direction: column;
    align-items: center;
    justify-content: center;
    color: var(--lyrics-color-active);
  }

  .details {
    display: block;
    line-height: 28px;
  }

  .normal-text {
    font-size: 16px;
    font-weight: 400;
    font-family: Arial, Helvetica, sans-serif;
  }

  button {
    align-self: flex-start;
    margin-top: 15px;
    white-space: nowrap;
    font-size: 14px;
    text-decoration: underline;
  }
</style>
