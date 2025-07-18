import "server-only";
import Stripe from "stripe";

export default function initStripe() {
  const stripe = new Stripe(process.env.STRIPE_SECRET_KEY);
  return stripe;
}

/**
 * Creates a new customer in Stripe using the provided data.
 *
 * @param {Stripe.CustomerCreateParams} data - The customer data to create a new customer in Stripe.
 * @param {Stripe.RequestOptions} [options] - The options for creating the customer in Stripe.
 * @returns {Promise<Stripe.Response<Stripe.Customer>>} A promise that resolves to the newly created Stripe customer object.
 * @throws Will throw an error if the customer creation fails.
 */

export async function createCustomer(data, options) {
  const stripe = initStripe();
  try {
    return stripe.customers.create(data, options);
  } catch (e) {
    throw e;
  }
}

/**
 * Retrieves a customer from Stripe by their ID.
 *
 * @param {string} id - The ID of the customer to retrieve.
 * optional params
 * @param {Stripe.CustomerRetrieveParams} [params] - The optional parameters for retrieving the customer from Stripe.
 * @param {Stripe.RequestOptions} [options] - The optional options for retrieving the customer from Stripe.
 * @returns {Promise<Stripe.Response<Stripe.Customer | Stripe.DeletedCustomer>>} A promise that resolves to the Stripe customer object.
 * @throws Will throw an error if the customer retrieval fails.
 */

export async function getCustomerById(id, params, options) {
  const stripe = initStripe();
  try {
    return stripe.customers.retrieve(id, params, options);
  } catch (e) {
    throw e;
  }
}

export async function getAllCustomers() {
  const stripe = initStripe();
  try {
    return stripe.customers.list();
  } catch (e) {
    throw e;
  }
}

/**
 * Creates a new customer in Stripe, if a customer with the same values for the provided `matcherKeys` does not already exist.
 *
 * @param {Stripe.CustomerCreateParams} data - The customer data to create a new customer in Stripe.
 * @param {Stripe.RequestOptions} [options] - The options for creating the customer in Stripe.
 * @param {[keyof Stripe.CustomerCreateParams]} [matcherKeys] - The keys to use when searching for a customer in Stripe.
 * @returns {Promise<Stripe.Response<Stripe.Customer>> | undefined} A promise that resolves to the newly created Stripe customer object.
 * @throws Will throw an error if the customer creation fails.
 */
export async function createUniqueCustomer(data, options, matcherKeys = []) {
  const stripe = initStripe();
  try {
    const query = matcherKeys
      .map((key) => `${key}:"${data[key]}"`)
      .join(" AND ");
    const findedCustomer = await stripe.customers.search({
      query,
    });
    if (findedCustomer?.data?.length < 1) {
      return stripe.customers.create(data, options);
    }
    throw new Error(
      `Provided ${matcherKeys.join()} matched with already existing customer.`,
    );
  } catch (e) {
    throw e;
  }
}

export async function deleteCustomer(id) {
  if (!id) throw new Error("Customer id is required");
  const stripe = initStripe();

  try {
    const getCustomer = await getCustomerById(id);
    if (getCustomer.deleted) return;
    return stripe.customers.del(id);
  } catch (e) {
    throw e;
  }
}
