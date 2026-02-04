using UnityEngine;

public class CarController : MonoBehaviour
{
    public float acceleration = 1500f;
    public float steeringSpeed = 15f;
    public float brakeForce = 3000f;
    
    private Rigidbody rb;
    private float horizontalInput;
    private float verticalInput;

    void Start() { rb = GetComponent<Rigidbody>(); }

    void Update()
    {
        horizontalInput = Input.GetAxis("Horizontal");
        verticalInput = Input.GetAxis("Vertical");
    }

    void FixedUpdate()
    {
        // Acceleration
        if (verticalInput != 0)
            rb.AddRelativeForce(Vector3.forward * verticalInput * acceleration);

        // Steering (only when moving)
        float steerAmount = horizontalInput * steeringSpeed * (rb.velocity.magnitude / 10f);
        transform.Rotate(Vector3.up * steerAmount);

        // Simple Braking
        if (Input.GetKey(KeyCode.Space))
            rb.drag = 2f;
        else
            rb.drag = 0.05f;
    }
}
