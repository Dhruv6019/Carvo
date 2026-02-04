using UnityEngine;
using TMPro;
using UnityEngine.SceneManagement;
using UnityEngine.UI;

public class UIManager : MonoBehaviour
{
    public TextMeshProUGUI speedText;
    public GameObject pausePanel;
    public Rigidbody carRigidbody;

    private bool isPaused = false;

    void Update()
    {
        // Speed Calculation (m/s to km/h)
        float speed = carRigidbody.velocity.magnitude * 3.6f;
        if (speedText != null)
            speedText.text = Mathf.Round(speed).ToString() + " KM/H";

        // Toggle Pause with Escape
        if (Input.GetKeyDown(KeyCode.Escape))
        {
            if (isPaused) ResumeGame();
            else PauseGame();
        }
    }

    public void PauseGame()
    {
        isPaused = true;
        pausePanel.SetActive(true);
        Time.timeScale = 0f;
    }

    public void ResumeGame()
    {
        isPaused = false;
        pausePanel.SetActive(false);
        Time.timeScale = 1f;
    }

    public void ExitToMain()
    {
        Time.timeScale = 1f;
        SceneManager.LoadScene("MainMenu");
    }
}
